import { NextResponse } from "next/server";
import { supabaseClient } from "@/lib/supabase-client";

export async function GET() {
  try {
    // 환경 변수 확인
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        {
          success: false,
          error: "환경 변수가 설정되지 않았습니다",
          details: {
            hasUrl: !!supabaseUrl,
            hasKey: !!supabaseKey,
          },
        },
        { status: 500 }
      );
    }

    // URL 형식 검증
    const urlPattern = /^https?:\/\/.+/;
    const isUrlValid = urlPattern.test(supabaseUrl.trim());
    const cleanedUrl = supabaseUrl.trim().replace(/\/$/, "");

    // URL이 올바른 Supabase 형식인지 확인
    const isSupabaseUrl = cleanedUrl.includes("supabase.co");

    // 환경 변수 정보 (디버깅용)
    const envInfo = {
      urlLength: supabaseUrl.length,
      urlStartsWith: supabaseUrl.substring(0, 8),
      urlEndsWith: supabaseUrl.substring(Math.max(0, supabaseUrl.length - 20)),
      urlIsValid: isUrlValid,
      urlIsSupabaseFormat: isSupabaseUrl,
      keyLength: supabaseKey.length,
      keyStartsWith: supabaseKey.substring(0, 20),
      urlHasTrailingSlash: supabaseUrl.endsWith("/"),
    };

    // URL 형식이 잘못된 경우
    if (!isUrlValid) {
      return NextResponse.json(
        {
          success: false,
          error: "URL 형식이 올바르지 않습니다",
          details: {
            ...envInfo,
            expectedFormat: "https://[project-id].supabase.co",
            actualUrl: cleanedUrl,
          },
        },
        { status: 500 }
      );
    }

    // Supabase URL 형식이 아닌 경우 경고
    if (!isSupabaseUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "Supabase URL 형식이 아닙니다",
          details: {
            ...envInfo,
            note: "URL은 'https://[project-id].supabase.co' 형식이어야 합니다. 대시보드 URL이 아닌 API URL을 사용해야 합니다.",
            actualUrl: cleanedUrl,
          },
        },
        { status: 500 }
      );
    }

    // 직접 fetch를 시도하여 연결 확인
    try {
      const healthCheckUrl = `${cleanedUrl}/rest/v1/`;
      const healthResponse = await fetch(healthCheckUrl, {
        method: "GET",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
        // 타임아웃 설정
        signal: AbortSignal.timeout(10000), // 10초 타임아웃
      });

      if (!healthResponse.ok) {
        return NextResponse.json(
          {
            success: false,
            error: "Supabase 서버 응답 오류",
            details: {
              ...envInfo,
              status: healthResponse.status,
              statusText: healthResponse.statusText,
              note: "서버는 응답했지만 오류 상태 코드를 반환했습니다.",
            },
          },
          { status: 500 }
        );
      }
    } catch (fetchError) {
      // 오류 객체를 그대로 직렬화하여 반환
      const errorDetails: any = {
        ...envInfo,
      };

      if (fetchError instanceof Error) {
        // Error 객체의 모든 속성 추출
        errorDetails.errorType = fetchError.constructor.name;
        errorDetails.errorMessage = fetchError.message;
        errorDetails.errorStack = fetchError.stack;
        errorDetails.errorName = fetchError.name;
        
        // cause 속성이 있으면 재귀적으로 추출
        if (fetchError.cause) {
          if (fetchError.cause instanceof Error) {
            errorDetails.errorCause = {
              type: fetchError.cause.constructor.name,
              message: fetchError.cause.message,
              stack: fetchError.cause.stack,
              name: fetchError.cause.name,
              // cause의 cause도 추출
              cause: fetchError.cause.cause,
            };
          } else {
            errorDetails.errorCause = fetchError.cause;
          }
        }

        // Error 객체의 모든 열거 가능한 속성 추가
        Object.keys(fetchError).forEach((key) => {
          try {
            errorDetails[key] = (fetchError as any)[key];
          } catch {
            // 직렬화 불가능한 속성은 무시
          }
        });
      } else {
        // Error 객체가 아닌 경우
        errorDetails.rawError = String(fetchError);
        errorDetails.errorType = typeof fetchError;
        try {
          errorDetails.errorObject = JSON.parse(JSON.stringify(fetchError));
        } catch {
          errorDetails.errorObject = "직렬화 불가능한 오류 객체";
        }
      }

      // 원본 오류를 문자열로 변환 시도
      try {
        errorDetails.rawErrorString = JSON.stringify(fetchError, Object.getOwnPropertyNames(fetchError), 2);
      } catch {
        errorDetails.rawErrorString = "오류 객체를 JSON으로 변환할 수 없습니다";
      }

      return NextResponse.json(
        {
          success: false,
          error: "Supabase 서버에 연결할 수 없습니다",
          details: errorDetails,
        },
        { status: 500 }
      );
    }

    // Supabase 클라이언트를 통한 테스트
    const { data, error } = await supabaseClient
      .from("_test_connection")
      .select("*")
      .limit(1);

    // 테이블이 없어도 연결은 성공한 것으로 간주
    if (error) {
      // PGRST116: 테이블이 존재하지 않음
      // 42P01: PostgreSQL 테이블이 존재하지 않음
      if (error.code === "PGRST116" || error.code === "42P01") {
        return NextResponse.json({
          success: true,
          message: "✅ Supabase 연결 성공!",
          details: {
            ...envInfo,
            note: "테이블이 없어서 조회는 실패했지만, Supabase 서버와의 연결은 정상입니다.",
          },
        });
      }

      // 다른 에러인 경우 - 전체 오류 객체 반환
      const errorDetails: any = {
        ...envInfo,
        message: error.message,
        code: error.code,
        hint: error.hint,
        details: error.details,
      };

      // 오류 객체의 모든 속성 추출
      Object.keys(error).forEach((key) => {
        try {
          errorDetails[key] = (error as any)[key];
        } catch {
          // 직렬화 불가능한 속성은 무시
        }
      });

      return NextResponse.json(
        {
          success: false,
          error: "Supabase 연결 실패",
          details: errorDetails,
          rawError: error,
        },
        { status: 500 }
      );
    }

    // 데이터가 성공적으로 조회된 경우
    return NextResponse.json({
      success: true,
      message: "✅ Supabase 연결 성공! 데이터 조회도 성공했습니다.",
      details: {
        ...envInfo,
        dataCount: data?.length || 0,
      },
      data,
    });
  } catch (error) {
    // 최상위 catch 블록 - 모든 오류를 상세히 반환
    const errorDetails: any = {
      errorType: error instanceof Error ? error.constructor.name : typeof error,
    };

    if (error instanceof Error) {
      errorDetails.errorMessage = error.message;
      errorDetails.errorStack = error.stack;
      errorDetails.errorName = error.name;
      
      if (error.cause) {
        if (error.cause instanceof Error) {
          errorDetails.errorCause = {
            type: error.cause.constructor.name,
            message: error.cause.message,
            stack: error.cause.stack,
            name: error.cause.name,
            cause: error.cause.cause,
          };
        } else {
          errorDetails.errorCause = error.cause;
        }
      }

      // Error 객체의 모든 속성 추출
      Object.keys(error).forEach((key) => {
        try {
          errorDetails[key] = (error as any)[key];
        } catch {
          // 직렬화 불가능한 속성은 무시
        }
      });

      // 원본 오류를 문자열로 변환
      try {
        errorDetails.rawErrorString = JSON.stringify(error, Object.getOwnPropertyNames(error), 2);
      } catch {
        errorDetails.rawErrorString = "오류 객체를 JSON으로 변환할 수 없습니다";
      }
    } else {
      errorDetails.rawError = String(error);
      try {
        errorDetails.errorObject = JSON.parse(JSON.stringify(error));
      } catch {
        errorDetails.errorObject = "직렬화 불가능한 오류 객체";
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "예기치 않은 오류 발생",
        details: errorDetails,
      },
      { status: 500 }
    );
  }
}


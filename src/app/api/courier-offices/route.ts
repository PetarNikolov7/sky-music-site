import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const courierMap: Record<string, "econt" | "speedy"> = {
  "Еконт": "econt",
  econt: "econt",
  "Спиди": "speedy",
  speedy: "speedy",
};

function cleanText(value: string | null, maxLength: number) {
  return (value ?? "").trim().slice(0, maxLength);
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const courierInput = cleanText(searchParams.get("courier"), 40);
    const city = cleanText(searchParams.get("city"), 120);
    const courier = courierMap[courierInput];

    if (!courier || city.length < 2) {
      return NextResponse.json({
        success: true,
        offices: [],
      });
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("courier_offices")
      .select("id, courier, city, office_id, name, address")
      .eq("courier", courier)
      .ilike("city", city)
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      console.error("Courier offices query error:", error);

      return NextResponse.json(
        { success: false, error: "Офисите не можаха да бъдат заредени." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      offices: data ?? [],
    });
  } catch (error) {
    console.error("Courier offices API error:", error);

    return NextResponse.json(
      { success: false, error: "Възникна грешка при зареждане на офисите." },
      { status: 500 },
    );
  }
}

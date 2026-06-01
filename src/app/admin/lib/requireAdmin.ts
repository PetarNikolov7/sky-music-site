import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/admin/login");
  }

  const { data: adminProfile, error: profileError } = await supabase
    .from("admin_profiles")
    .select("display_name, active")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profileError || !adminProfile?.active) {
    redirect(
      `/admin/login?error=${encodeURIComponent(
        "Този акаунт няма активен административен достъп.",
      )}`,
    );
  }

  return {
    supabase,
    user,
    adminProfile: {
      displayName: adminProfile.display_name ?? "SKY MUSIC BG Admin",
      active: Boolean(adminProfile.active),
    },
  };
}

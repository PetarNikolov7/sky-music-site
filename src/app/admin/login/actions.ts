"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function redirectWithError(message: string): never {
  redirect(`/admin/login?error=${encodeURIComponent(message)}`);
}

export async function login(formData: FormData) {
  const emailValue = formData.get("email");
  const passwordValue = formData.get("password");

  const email =
    typeof emailValue === "string" ? emailValue.trim().toLowerCase() : "";
  const password =
    typeof passwordValue === "string" ? passwordValue : "";

  if (!email || !password) {
    redirectWithError("Моля, въведете имейл и парола.");
  }

  const supabase = await createClient();

  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (authError || !authData.user) {
    redirectWithError("Невалиден имейл или парола.");
  }

  const { data: adminProfile, error: adminError } = await supabase
    .from("admin_profiles")
    .select("active")
    .eq("user_id", authData.user.id)
    .maybeSingle();

  if (adminError || !adminProfile?.active) {
    await supabase.auth.signOut();

    redirectWithError("Този акаунт няма активен административен достъп.");
  }

  redirect("/admin");
}
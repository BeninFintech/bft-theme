import { useState } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { PasswordInput } from "@/components/overrides/custom-password-input";
import { Button, Input, Checkbox, Field, FieldLabel, FieldSeparator } from "@/components/ui";
import { TemplateContent, TemplateFooter } from "@/login/TemplateComponents";
import type { KcContext } from "@/login/KcContext";
import type { I18n } from "@/login/i18n";
import { SocialProviderButton } from "@/components/overrides/social-provider-button";
import { cn } from "@/lib/utils";

export default function Login(props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
  const { social, realm, url, usernameHidden, login, auth, registrationDisabled, messagesPerField } = kcContext;
  const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);
  const { msg, msgStr } = i18n;

  return (
    <Template
      {...{ kcContext, i18n, doUseDefaultCss, classes }}
      displayMessage={!messagesPerField.existsError("username", "password")}
      headerNode={msg("loginAccountTitle")}
      displayInfo={false}
      socialProvidersNode={null}
    >
      {realm.password && (
        <>
          <TemplateContent className="space-y-8">
            <form
              id="kc-form-login"
              className="flex flex-col gap-4"
              onSubmit={() => setIsLoginButtonDisabled(true)}
              action={url.loginAction}
              method="post"
            >
              {!usernameHidden && (
                <Field>
                  <FieldLabel htmlFor="username">
                    {!realm.loginWithEmailAllowed ? msg("username") : !realm.registrationEmailAsUsername ? msg("usernameOrEmail") : msg("email")}
                  </FieldLabel>
                  <Input
                    id="username"
                    name="username"
                    tabIndex={2}
                    defaultValue={login.username ?? ""}
                    type="text"
                    autoFocus
                    autoComplete="username"
                    aria-invalid={messagesPerField.existsError("username", "password")}
                  />
                  {messagesPerField.existsError("username", "password") && (
                    <span
                      className="text-destructive text-sm"
                      dangerouslySetInnerHTML={{
                        __html: kcSanitize(messagesPerField.getFirstError("username", "password"))
                      }}
                    />
                  )}
                </Field>
              )}

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">{msg("password")}</FieldLabel>
                  {realm.resetPasswordAllowed && (
                    <a href={url.loginResetCredentialsUrl} className="ml-auto text-xs underline-offset-4 hover:underline">
                      {msg("doForgotPassword")}
                    </a>
                  )}
                </div>
                <PasswordInput
                  tabIndex={3}
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  aria-invalid={messagesPerField.existsError("username", "password")}
                />
                {usernameHidden && messagesPerField.existsError("username", "password") && (
                  <span
                    className="text-destructive text-sm"
                    dangerouslySetInnerHTML={{
                      __html: kcSanitize(messagesPerField.getFirstError("username", "password"))
                    }}
                  />
                )}
              </Field>

              {realm.rememberMe && !usernameHidden && (
                <div className="flex items-center space-x-2">
                  <Checkbox id="rememberMe" name="rememberMe" defaultChecked={!!login.rememberMe} tabIndex={5} />
                  <label htmlFor="rememberMe" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {msg("rememberMe")}
                  </label>
                </div>
              )}

              <input type="hidden" id="id-hidden-input" name="credentialId" value={auth.selectedCredential} />
              <Button type="submit" name="login" className="w-full" disabled={isLoginButtonDisabled} tabIndex={7} id="kc-login">
                {msgStr("doLogIn")}
              </Button>
            </form>

            {/* Social providers separator */}
            {social?.providers && social.providers.length > 0 && (
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                {msgStr("identity-provider-login-label")}
              </FieldSeparator>
            )}
          </TemplateContent>
          <TemplateFooter className="flex-col gap-2 space-y-6">
            {social?.providers && social.providers.length > 0 && (
              <div className={cn("w-full grid gap-3 grid-cols-1", social.providers.length > 1 && "md:grid-cols-2")}>
                {social.providers.map((p) => (
                  <SocialProviderButton
                    key={p.alias}
                    alias={p.alias}
                    displayName={p.displayName}
                    loginUrl={p.loginUrl}
                    id={`social-${p.alias}`}
                  />
                ))}
              </div>
            )}
            {realm.registrationAllowed && !registrationDisabled && (
              <div className="text-center text-sm">
                {msg("noAccount")}{" "}
                <a href={url.registrationUrl} className="underline underline-offset-4" tabIndex={8}>
                  {msg("doRegister")}
                </a>
              </div>
            )}
          </TemplateFooter>
        </>
      )}
    </Template>
  );
}

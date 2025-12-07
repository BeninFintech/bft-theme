import { useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "@/login/KcContext";
import type { I18n } from "@/login/i18n";
import { Button, Input, Checkbox, Field, FieldLabel } from "@/components/ui";
import { TemplateContent } from "@/login/TemplateComponents";
import { SocialProviders } from "@/components/overrides/social-providers";

export default function LoginUsername(props: PageProps<Extract<KcContext, { pageId: "login-username.ftl" }>, I18n>) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
  const { social, realm, url, usernameHidden, login, messagesPerField } = kcContext;
  const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);
  const { msg, msgStr } = i18n;

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayMessage={!messagesPerField.existsError("username")}
      displayInfo={false}
      headerNode={msg("doLogIn")}
      socialProvidersNode={<SocialProviders providers={social?.providers} label={msgStr("identity-provider-login-label")} />}
    >
      {realm.password && (
        <TemplateContent>
          <form
            id="kc-form-login"
            className="flex flex-col gap-4"
            onSubmit={() => {
              setIsLoginButtonDisabled(true);
              return true;
            }}
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
                  aria-invalid={messagesPerField.existsError("username")}
                />
                {messagesPerField.existsError("username") && (
                  <span
                    className="text-destructive text-sm"
                    dangerouslySetInnerHTML={{
                      __html: messagesPerField.getFirstError("username")
                    }}
                  />
                )}
              </Field>
            )}

            {realm.rememberMe && !usernameHidden && (
              <div className="flex items-center space-x-2">
                <Checkbox id="rememberMe" name="rememberMe" defaultChecked={!!login.rememberMe} tabIndex={3} />
                <label
                  htmlFor="rememberMe"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {msg("rememberMe")}
                </label>
              </div>
            )}

            <Button tabIndex={4} type="submit" className="w-full" disabled={isLoginButtonDisabled}>
              {msgStr("doLogIn")}
            </Button>
          </form>
        </TemplateContent>
      )}
    </Template>
  );
}

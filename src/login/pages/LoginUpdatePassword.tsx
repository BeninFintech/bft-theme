import { useState } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { PasswordInput } from "@/components/overrides/custom-password-input";
import { Checkbox } from "@/components/ui/checkbox";
import type { KcContext } from "@/login/KcContext";
import type { I18n } from "@/login/i18n";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function LoginUpdatePassword(props: PageProps<Extract<KcContext, { pageId: "login-update-password.ftl" }>, I18n>) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
  const { url, messagesPerField, isAppInitiatedAction } = kcContext;
  const { msg, msgStr } = i18n;
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(false);

  return (
    <Template
      {...{ kcContext, i18n, doUseDefaultCss, classes }}
      displayMessage={!messagesPerField.existsError("password", "password-confirm")}
      headerNode={msg("updatePasswordTitle")}
    >
      <form
        id="kc-passwd-update-form"
        className="flex flex-col gap-4"
        onSubmit={() => setIsSubmitButtonDisabled(true)}
        action={url.loginAction}
        method="post"
      >
        <div className="grid gap-2">
          <Label htmlFor="password-new">{msg("passwordNew")}</Label>
          <PasswordInput
            id="password-new"
            name="password-new"
            autoFocus
            autoComplete="new-password"
            aria-invalid={messagesPerField.existsError("password")}
          />
          {messagesPerField.existsError("password") && (
            <span
              className="text-destructive text-sm"
              dangerouslySetInnerHTML={{
                __html: kcSanitize(messagesPerField.get("password"))
              }}
            />
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password-confirm">{msg("passwordConfirm")}</Label>
          <PasswordInput
            id="password-confirm"
            name="password-confirm"
            autoComplete="new-password"
            aria-invalid={messagesPerField.existsError("password-confirm")}
          />
          {messagesPerField.existsError("password-confirm") && (
            <span
              className="text-destructive text-sm"
              dangerouslySetInnerHTML={{
                __html: kcSanitize(messagesPerField.get("password-confirm"))
              }}
            />
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="logout-sessions" name="logout-sessions" defaultChecked />
          <label htmlFor="logout-sessions" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {msg("logoutOtherSessions")}
          </label>
        </div>

        <div className="flex gap-2">
          <Button
            type="submit"
            className="flex-1"
            disabled={isSubmitButtonDisabled}
            id="kc-submit"
          >
            {msgStr("doSubmit")}
          </Button>
          {isAppInitiatedAction && (
            <Button
              type="submit"
              className="flex-1"
              variant="outline"
              name="cancel-aia"
              value="true"
              id="kc-cancel"
            >
              {msgStr("doCancel")}
            </Button>
          )}
        </div>
      </form>
    </Template>
  );
}

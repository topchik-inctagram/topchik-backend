export const emailExamples = {
  registrationEmail(code: string, url: string) {
    return ` <h1>Thank for your registration</h1>
               <p>To finish registration please follow the link below:<br>
                  <a href="${url}?code=${code}">complete registration</a>
              </p>`;
  },
  passwordRecoveryEmail(code: string, url: string) {
    return `<h1>Password recovery</h1>
        <p>To finish password recovery please follow the link below:
            <a href="${url}?recoveryCode=${code}">recovery password</a>
        </p>`;
  },
};

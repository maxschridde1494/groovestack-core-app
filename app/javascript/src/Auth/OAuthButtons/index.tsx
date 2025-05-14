import { Stack } from "@mui/material";
import { useState } from "react";

// import { FacebookOAuthButton } from "./Facebook";
// import { GoogleOAuthButton } from "./Google";
import { OAuthButton } from "./Button";
import { 
  OAuthButtonsProps, 
  // SpecializedOAuthButton 
} from "./types";
// import { notifyError } from "../../../shared/bugsnag";

// const SpecializedBtns: { [k: string]: SpecializedOAuthButton } = {
//   facebook: FacebookOAuthButton,
//   google: GoogleOAuthButton,
// };

export const OAuthButtons = ({ providers, specialized }: OAuthButtonsProps) => {
  const [buttonsDisabled, setButtonsDisabled] = useState(false);

  // const onError = (error, meta) => {
  //   notifyError(error, (event) => {
  //     // event.setUser(currentUser?.id, currentUser?.email, currentUser?.name);
  //     if (meta) event.addMetadata("meta", meta);
  //   });

  //   // notifyError(error, (event) => {
  //   // event.setUser(currentUser?.id, currentUser?.email, currentUser?.name);
  //   // });
  // };

  return (
    <Stack width="100%" gap={2}>
      {providers.map((provider) => {
        // const Btn = SpecializedBtns[provider.key];

        // if (Btn)
        //   return (
        //     <Btn
        //       key={provider.key}
        //       path={provider.path}
        //       name={provider.name}
        //       disabled={buttonsDisabled}
        //       setDisabled={setButtonsDisabled}
        //       onError={onError}
        //       {...specialized?.[provider.key]}
        //     />
        //   );

        return (
          <OAuthButton
            key={provider.key}
            providerId={provider.key}
            path={provider.path}
            name={provider.name}
            disabled={buttonsDisabled}
            setDisabled={setButtonsDisabled}
            // onError={onError}
          />
        );
      })}
    </Stack>
  );
};

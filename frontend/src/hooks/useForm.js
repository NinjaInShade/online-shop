import { useState } from "react";
import axios from "axios";

export default function useForm() {
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState(undefined);

  function validateAndSendForm(states, reqDomain, postBody, cb, options) {
    // Dont let user send new req/resubmit form is already sending
    if (loading) {
      return;
    }

    for (let i = 0; i < states.length; i++) {
      // Validate if user has typed
      if (!states[i].hasTyped && options.enableTyped) {
        console.log(states, states[i]);
        return setGlobalError("Form not filled in");
      }

      // Validate if any errors have occurred
      if (states[i].error !== "default") {
        return setGlobalError("Form invalid");
      }

      // Form is now valid, set loading state while sending request to backend
      setLoading(true);

      sendFormRequest(reqDomain, postBody, cb);
    }
  }

  function sendFormRequest(reqDomain, postBody, cb) {
    axios
      .post(reqDomain, postBody)
      .then((response) => {
        const data = response.data;

        cb(null, data);
      })
      .catch((error) => {
        const err = error.response.data.error_message;
        setLoading(false);
        setGlobalError(err);

        cb(err, null);
      });
  }

  return { loading, globalError, validateAndSendForm };
}

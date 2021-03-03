import { useState } from "react";
import axios from "axios";

export default function useForm() {
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState(undefined);

  function validateAndSendForm(states, reqDomain, postBody, cb, options) {
    let headers = options.headers;

    if (options.file) {
      headers = {
        ...headers,
        "Content-Type": "multipart/form-data",
      };

      const formData = new FormData();
      formData.append("title", postBody.title);
      formData.append("description", postBody.description);
      formData.append("price", postBody.price);
      formData.append("image", postBody.image);

      postBody = formData;
    }

    // Dont let user send new req/resubmit form is already sending
    if (loading) {
      return;
    }

    for (let i = 0; i < states.length; i++) {
      // Validate if user has typed
      if (!states[i].hasTyped && options.enableTyped) {
        return setGlobalError("Form not filled in");
      }

      // Validate if any errors have occurred
      if (states[i].error !== "default") {
        return setGlobalError("Form invalid");
      }
    }
    // Form is now valid, set loading state while sending request to backend
    setLoading(true);

    sendFormRequest(reqDomain, postBody, headers, cb);
  }

  function sendFormRequest(reqDomain, postBody, headers, cb) {
    axios({
      method: "post",
      url: reqDomain,
      data: postBody,
      headers,
    })
      .then((response) => {
        const data = response.data;

        setGlobalError(undefined);
        setLoading(false);
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

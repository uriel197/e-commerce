const productionUrl = "http://localhost:5000/api/v1";

export const customFetch = async (endpoint, options = {}) => {
  try {
    const url = new URL(`${productionUrl}${endpoint}`);

    // If params are provided, append them to the URL
    if (options.params) {
      /* 1 */
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, value);
        }
      });
      delete options.params; // Remove params from options to avoid conflicts
    }

    // Set default headers
    const headers = {
      "Content-Type": "application/json",
      ...options.headers, // Allow overriding headers
    };

    // Convert body to JSON if it's an object and Content-Type is JSON
    if (options.body) {
      options.body = JSON.stringify(options.body);
    }

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });

    // Check Content-Type to avoid parsing non-JSON
    const contentType = response.headers.get("content-type");
    if (!response.ok) {
      // Parse and throw error for detailed handling
      const errorData = await response.json();
      throw new Error(errorData.msg || "Request failed", {
        cause: { status: response.status },
      });
    }

    // Only parse JSON if Content-Type indicates JSON
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }
    throw new Error("Unexpected response format", {
      cause: { status: response.status },
    });
  } catch (error) {
    console.error("Fetch error:", error.message, {
      status: error.cause?.status,
    });
    throw error;
  }
};

export const queryFetch = async (endpoint, options = {}) => {
  const url = new URL(`${productionUrl}${endpoint}`);
  console.log("Fetching from network:", url);

  if (options.params) {
    Object.entries(options.params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }
  delete options.params;

  const response = await fetch(url, {
    ...options,
    credentials: "include",
  });
  const data = await response.json();
  return data;
};

export const formatPrice = (price) => {
  const dollarsAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format((price / 100).toFixed(2));
  return dollarsAmount;
};

export const generateAmountOptions = (number) => {
  return Array.from({ length: number }, (_, index) => {
    const amount = index + 1;
    return (
      <option key={amount} value={amount}>
        {amount}
      </option>
    );
  });
};

/*
=======================================
     COMMENTS - COMMENTS - COMMENTS
=======================================
*** 1: For each key-value pair, if the value is neither undefined nor null, it appends the key and value to the url.searchParams object using the append method. This adds the parameters to the query string of the URL which After processing, it removes the params property from the options object to avoid potential conflicts later in the code.

 





*/

const productionUrl = "http://localhost:5000/api/v1";

export const customFetch = async (endpoint, options = {}) => {
  try {
    const url = new URL(`${productionUrl}${endpoint}`);

    // If params are provided, append them to the URL
    if (options.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
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

    if (!response.ok) {
      // Parse and throw error for detailed handling
      const errorData = await response.json();
      throw { response: errorData, status: response.status };
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
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

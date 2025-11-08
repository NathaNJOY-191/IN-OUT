const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

async function request(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const text = await res.text();
    let err: any = new Error(text || res.statusText);
    try {
      const json = JSON.parse(text);
      err = new Error(json.message || JSON.stringify(json));
    } catch {}
    throw err;
  }

  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) return res.json();
  return res.text();
}

export const api = {
  auth: {
    signup: (email: string, password: string, full_name: string) =>
      request('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, full_name }),
      }),
    signin: (email: string, password: string) =>
      request('/auth/signin', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    me: () => request('/auth/me'),
    signout: () => {
      localStorage.removeItem('token');
      return Promise.resolve();
    },
  },
  payments: {
    createOrder: (amount: number) => 
      request('/create-order', {
        method: 'POST',
        body: JSON.stringify({ amount: Math.round(amount) }), // Ensure amount is a whole number
      }),
    verifyPayment: (paymentData: {
      bookingId: string;
      razorpay_payment_id: string;
      razorpay_order_id: string;
      razorpay_signature: string;
    }) =>
      request('/verify-payment', {
        method: 'POST',
        body: JSON.stringify(paymentData),
      }),
  },
  rooms: {
    list: () => request('/rooms'),
    get: (id: string) => request(`/rooms/${id}`),
  },
  bookings: {
    listForUser: () => request('/bookings/mine'),
    create: (payload: any) => request('/bookings', { method: 'POST', body: JSON.stringify(payload) }),
    cancel: (id: string) => request(`/bookings/${id}/cancel`, { method: 'POST' }),
  },
};

export default api;

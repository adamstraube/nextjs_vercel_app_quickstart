import auth0 from '../../../../lib/auth0';

const handler = auth0.handleAuth();

// For Back-Channel Logout you need to export a GET and a POST handler.
export { handler as GET, handler as POST };
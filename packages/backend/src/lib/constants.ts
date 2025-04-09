export const HTTP_STATUS_CODES = {
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.6.1
   *
   * The server encountered an unexpected condition that prevented it from fulfilling the request.
   */
  INTERNAL_SERVER_ERROR: 500,
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.8
   *
   * This response is sent when a request conflicts with the current state of the server.
   */
  BAD_REQUEST: 400,
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.4.3
   *
   * This response code means that URI of requested resource has been changed temporarily. New changes in the URI might be made in the future. Therefore, this same URI should be used by the client in future requests.
   */
  MOVED_TEMPORARILY: 302,
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.3.1
   *
   * The request has succeeded. The meaning of a success varies depending on the HTTP method:
   * GET: The resource has been fetched and is transmitted in the message body.
   * HEAD: The entity headers are in the message body.
   * POST: The resource describing the result of the action is transmitted in the message body.
   * TRACE: The message body contains the request message as received by the server
   */
  OK: 200,
  CREATED: 201,
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc6585#section-4
   *
   * The user has sent too many requests in a given amount of time ("rate limiting").
   */
  TOO_MANY_REQUESTS: 429,

  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7235#section-3.1
   *
   * Although the HTTP standard specifies "unauthorized", semantically this response means "unauthenticated". That is, the client must authenticate itself to get the requested response.
   */
  UNAUTHORIZED: 401,

  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.3
   *
   * The request was well-formed but was unable to be followed due to semantic errors.
   */
  UNPROCESSABLE_ENTITY: 422,

  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.4
   *
   * The server can not find requested resource. In the browser, this means the URL is not recognized. In an API, this can also mean that the endpoint is valid but the resource itself does not exist. Servers may also send this response instead of 403 to hide the existence of a resource from an unauthorized client. This response code is probably the most famous one due to its frequent occurence on the web.
   */
  NOT_FOUND: 404,

  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.3.5
   *
   * There is no content to send for this request, but the headers may be useful. The user-agent may update its cached headers for this resource with the new ones.
   */
  NO_CONTENT: 204,

  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.3
   *
   * The client does not have access rights to the content, i.e. they are unauthorized, so server is rejecting to give proper response. Unlike 401, the client's identity is known to the server.
   */
  FORBIDDEN: 403,
} as const;

export const HTTP_STATUS_PHRASES = {
  INTERNAL_SERVER_ERROR: "Internal Server Error",
  BAD_REQUEST: "Bad Request",
  MOVED_TEMPORARILY: "Moved Temporarily",
  OK: "OK",
  TOO_MANY_REQUESTS: "Too Many Requests",
  UNAUTHORIZED: "Unauthorized",
  UNPROCESSABLE_ENTITY: "Unprocessable Entity",
  NOT_FOUND: "Not Found",
  NO_CONTENT: "No Content",
  FORBIDDEN: "Forbidden",
} as const;

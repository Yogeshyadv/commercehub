/**
 * Standardised API response helpers.
 * All JSON responses should go through one of these methods so that
 * clients always receive a consistent response shape.
 *
 * Shape:
 *   { success, message, data?, pagination? }
 */
class ApiResponse {
  /**
   * 200 OK — general success with optional data payload.
   */
  static success(res, data = null, message = 'Success', statusCode = 200) {
    const body = { success: true, message };
    if (data !== null) body.data = data;
    return res.status(statusCode).json(body);
  }

  /**
   * 201 Created — resource successfully created.
   */
  static created(res, data = null, message = 'Created successfully') {
    const body = { success: true, message };
    if (data !== null) body.data = data;
    return res.status(201).json(body);
  }

  /**
   * 200 OK — paginated list response.
   * @param {object} pagination  { page, limit, total, pages }
   */
  static paginated(res, data, pagination, message = 'Success') {
    return res.status(200).json({
      success: true,
      message,
      data,
      pagination,
    });
  }

  /**
   * 204 No Content — successful operation with no body.
   */
  static noContent(res) {
    return res.status(204).send();
  }

  /**
   * 400 Bad Request
   */
  static badRequest(res, message = 'Bad request') {
    return res.status(400).json({ success: false, message });
  }

  /**
   * 401 Unauthorized
   */
  static unauthorized(res, message = 'Not authorized') {
    return res.status(401).json({ success: false, message });
  }

  /**
   * 403 Forbidden
   */
  static forbidden(res, message = 'Forbidden') {
    return res.status(403).json({ success: false, message });
  }

  /**
   * 404 Not Found
   */
  static notFound(res, message = 'Resource not found') {
    return res.status(404).json({ success: false, message });
  }
}

module.exports = ApiResponse;

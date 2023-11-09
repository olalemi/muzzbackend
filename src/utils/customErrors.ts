class CustomError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number = 400, name: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = name;
  }
  
  toJSON() {
    return {
      code: this.statusCode,
      status: "error",
      message: this.message || "something went wrong, try again later",
      data: process.env.NODE_ENV !== "production" ? this.stack : null
    };
  }
}

export { CustomError };

import mongoose from "mongoose";

// Cache the connection across serverless invocations
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Normalize the MONGO_URI from .env:
 *  - trim whitespace / surrounding quotes
 *  - auto-add "mongodb+srv://" if the user forgot the protocol
 *  - give a precise error otherwise
 */
function resolveMongoUri() {
  let uri = (process.env.MONGO_URI || "").trim();

  // Strip accidental surrounding quotes
  if (
    (uri.startsWith('"') && uri.endsWith('"')) ||
    (uri.startsWith("'") && uri.endsWith("'"))
  ) {
    uri = uri.slice(1, -1).trim();
  }

  if (!uri) {
    throw new Error(
      "MONGO_URI is empty. Set it in backend/.env (mongodb+srv://USER:PASS@cluster.mongodb.net/db)."
    );
  }

  // Already has a valid scheme → use as-is
  if (uri.startsWith("mongodb://") || uri.startsWith("mongodb+srv://")) {
    return uri;
  }

  // Looks like an Atlas hostname without protocol → auto-prefix it
  if (/^[\w.-]+\.mongodb\.(net|com)[/:]?/i.test(uri)) {
    const fixed = `mongodb+srv://${uri}`;
    console.warn(
      "[db] MONGO_URI was missing 'mongodb+srv://' — auto-corrected. Please fix backend/.env."
    );
    return fixed;
  }

  throw new Error(
    `MONGO_URI is malformed: "${uri.slice(0, 60)}...".\n` +
      "Expected format:\n" +
      "  mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/DBNAME?retryWrites=true&w=majority\n" +
      "Make sure BOTH the username AND password are present."
  );
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    let uri;
    try {
      uri = resolveMongoUri();
    } catch (err) {
      console.error("MONGO_URI error:", err.message);
      throw err;
    }

    cached.promise = mongoose
      .connect(uri, {
        serverSelectionTimeoutMS: 10000,
      })
      .then((m) => {
        console.log(`MongoDB Connected: ${m.connection.host}`);
        return m;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    console.error("MongoDB connection failed:", err.message);
    throw err;
  }

  return cached.conn;
};

export default connectDB;
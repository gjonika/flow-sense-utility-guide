export default function Unauthorized() {
  return (
    <div className="p-10 text-center text-red-600">
      <h1 className="text-2xl font-bold">🔒 Access Denied</h1>
      <p>You must enter using a valid code.</p>
    </div>
  );
}

export default function CancellationRefundPolicy() {
  return (
    <div className="flex-1 relative w-full min-h-screen flex items-center">
      <div className="p-6  max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          Cancellation & Refund Policy
        </h1>
        <p>
          All purchases made through <strong>IMAGE-TEXT-GIF</strong> are final.
          As a solo developer, I cannot offer refunds or cancellations once a
          payment has been processed.
        </p>
        <p className="mt-4">
          If you encounter any issues, feel free to reach out at{" "}
          <a href="mailto:work.manannegi@gmail.com" className="text-blue-500">
          work.manannegi@gmail.com
          </a>{" "}
          for assistance.
        </p>
      </div>
    </div>
  );
}

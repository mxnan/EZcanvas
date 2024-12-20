export default function TermsConditions() {
  return (
    <div className="flex-1 relative w-full min-h-screen flex items-center">
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Terms & Conditions</h1>
        <p>
          By using <strong>IMAGE-TEXT-GIF</strong>, you agree to the following
          terms:
        </p>
        <ul className="list-disc mt-4 pl-6">
          <li>This app is provided “as is” without any guarantees.</li>
          <li>
            You must not misuse the app for illegal or inappropriate activities.
          </li>
          <li>All generated content belongs to the user.</li>
        </ul>
        <p className="mt-4">
          If you disagree with these terms, kindly refrain from using the app.
        </p>
      </div>
    </div>
  );
}

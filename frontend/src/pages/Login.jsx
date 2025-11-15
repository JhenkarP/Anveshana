import React from "react";

function Login() {
  return (
    <>
      {" "}
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
      ;
    </>
  );
}

export default Login;

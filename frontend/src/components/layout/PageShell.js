import { Fragment } from "react";

function PageShell({ title, children }) {
  return (
    <Fragment>
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
          {title ? (
            <h1 className="mb-6 text-center text-2xl font-bold tracking-tight text-slate-900">
              {title}
            </h1>
          ) : null}
          {children}
        </div>
      </div>
    </Fragment>
  );
}

export default PageShell;



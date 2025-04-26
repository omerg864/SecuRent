export function Table({ className, ...props }) {
  return (
    <div className="w-full overflow-auto">
      <table
        className={`w-full caption-bottom text-sm ${className || ""}`}
        {...props}
      />
    </div>
  );
}

export function TableHeader({ className, ...props }) {
  return <thead className={className} {...props} />;
}

export function TableBody({ className, ...props }) {
  return <tbody className={className} {...props} />;
}

export function TableRow({ className, ...props }) {
  return (
    <tr
      className={`border-b transition-colors hover:bg-gray-200 dark:hover:bg-meta-4 data-[state=selected]:bg-muted ${
        className || ""
      }`}
      {...props}
    />
  );
}

export function TableHead({ className, ...props }) {
  return (
    <th
      className={`h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 ${
        className || ""
      }`}
      {...props}
    />
  );
}

export function TableCell({ className, ...props }) {
  return (
    <td
      className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${
        className || ""
      }`}
      {...props}
    />
  );
}

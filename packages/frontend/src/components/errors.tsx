export function FullScreenError(props: { title: string; message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="max-w-96">
        <p className="text-destructive text-2xl font-bold mb-2">
          {props.title}
        </p>
        {props.message && <p className="text-destructive">{props.message}</p>}
      </div>
    </div>
  );
}

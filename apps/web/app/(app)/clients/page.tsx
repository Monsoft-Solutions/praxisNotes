export default function ClientsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Clients</h1>
      <p>This is the clients page displayed within the dashboard layout.</p>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-muted/50 p-4 rounded-xl h-40"></div>
        <div className="bg-muted/50 p-4 rounded-xl h-40"></div>
      </div>
    </div>
  );
}

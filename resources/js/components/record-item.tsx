export function RecordItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="grid">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-base">{value}</p>
        </div>
    );
}

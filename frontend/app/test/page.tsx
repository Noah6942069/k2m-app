export default function TestPage() {
    return (
        <div style={{ padding: 50, background: '#0d0d12', color: 'white', minHeight: '100vh' }}>
            <h1 style={{ fontSize: 32, marginBottom: 20 }}>Test Page</h1>
            <p>If you can see this, the server is running correctly.</p>
            <p style={{ marginTop: 20, color: '#888' }}>Time: {new Date().toISOString()}</p>
        </div>
    )
}

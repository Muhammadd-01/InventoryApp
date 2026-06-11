import { useState, useEffect } from "react";
import { getActivityLogs } from "../services/db";
import { Activity, PackagePlus, Edit, Trash, ShoppingBag } from "lucide-react";
import { animateStagger } from "../utils/animations";

export function History() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await getActivityLogs();
        setLogs(data);
      } catch (error) {
        console.error("Error fetching logs", error);
      } finally {
        setLoading(false);
        setTimeout(() => animateStagger('.activity-item', 50), 100);
      }
    };
    fetchLogs();
  }, []);

  const getIconForAction = (action) => {
    switch (action) {
      case "Product Added": return <PackagePlus size={18} />;
      case "Product Updated": return <Edit size={18} />;
      case "Product Deleted": return <Trash size={18} />;
      case "Sale Recorded": return <ShoppingBag size={18} />;
      default: return <Activity size={18} />;
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Just now";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    }).format(date);
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Activity History</h1>
      </div>

      <div className="card">
        {loading ? (
          <div>Loading history...</div>
        ) : (
          <div className="activity-list">
            {logs.map(log => (
              <div key={log.id} className="activity-item">
                <div className="activity-icon">
                  {getIconForAction(log.action)}
                </div>
                <div className="activity-content">
                  <h4>{log.action}</h4>
                  <p>{log.details}</p>
                  <div className="activity-time">{formatDate(log.created_at)}</div>
                </div>
              </div>
            ))}
            {logs.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No recent activity</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

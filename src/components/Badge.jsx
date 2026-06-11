export function Badge({ quantity }) {
  if (quantity === 0) {
    return <span className="badge badge-danger">OUT OF STOCK</span>;
  }
  if (quantity <= 10) {
    return <span className="badge badge-warning">LOW STOCK</span>;
  }
  return <span className="badge badge-success">IN STOCK</span>;
}

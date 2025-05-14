import { detectEmbeddedBrowser } from "./authUtil";

export const AuthDiagnostics = ({ values }) => {
  // if the URL params contain `fb_debug`, show the diagnostics
  if (!new URLSearchParams(window.location.search).has("authdebug"))
    return null;

  return (
    <div
      style={{
        border: "1px solid #990000",
        borderRadius: 8,
        background: "#99000011",
        padding: 10,
      }}
    >
      <table style={{ width: "100%" }}>
        <thead>
          <tr>
            <th colSpan={100} style={{ textAlign: "center" }}>
              <b>DEBUG MODE</b>
            </th>
          </tr>
        </thead>
        <tbody>
          {values.map((value, idx) => (
            <tr key={idx}>
              <td
                style={{
                  color: "#333",
                  fontWeight: "bold",
                  textAlign: "right",
                }}
              >
                {value?.name}
              </td>
              <td style={{ width: "100%" }}>{value?.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

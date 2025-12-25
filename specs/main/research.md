# Research Findings for Implement Activity Logging for User Actions

## Decisions and Rationale

### Performance Goals for Activity Retrieval API
- **Decision:** Target `p95 response time < 200ms` for typical paginated and filtered queries on activity logs.
- **Rationale:** This aligns with general expectations for responsive API interactions and ensures that retrieving audit trails does not become a bottleneck for administrative or monitoring tasks.
- **Alternatives considered:** No strict performance targets (rejected due to potential for degraded user experience for administrative tasks); More aggressive targets like `p95 < 100ms` (rejected for initial implementation complexity without clear immediate need).

### Constraints: Maximum Log Volume and Retention Policy
- **Decision:**
    - Maximum anticipated log volume: `~1 million log entries per month`.
    - Retention Policy: Keep activity logs for `1 year`. Implement a scheduled job (e.g., nightly cron) to soft-delete or archive logs older than 1 year.
- **Rationale:** 1 million entries per month provides a reasonable estimate for a medium-scale application. A 1-year retention policy is a common requirement for auditing and compliance purposes, balancing data availability with storage costs.
- **Alternatives considered:** Infinite retention (rejected due to storage cost and query performance degradation over time); Shorter retention (rejected as it might not meet auditing requirements).

### Scale/Scope: Anticipated Active Users and Logged Actions
- **Decision:**
    - Anticipated Active Users: `Up to 5,000` concurrent users.
    - Frequency of Logged Actions: Average `10-20 actions per user per day`.
    - Data Retention Period: `1 year` (consistent with constraints).
- **Rationale:** These figures inform the expected load on the logging system and the database, helping validate the chosen technologies and design patterns.
- **Alternatives considered:** Lower/higher estimates (rejected as current estimates are reasonable for a typical initial deployment of such an application).

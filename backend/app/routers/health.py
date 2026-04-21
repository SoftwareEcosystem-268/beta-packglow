"""
Health Router - Health check endpoint
=====================================

Router นี้มีเพียง 1 endpoint สำหรับตรวจสอบว่า API พร้อมใช้งาน

การใช้งาน:
    GET /api/v1/health -> {"status": "ok"}

Use cases:
- Load balancer health check
- Kubernetes liveness probe
- Monitoring systems (Prometheus, Datadog)
"""

from fastapi import APIRouter

router = APIRouter(tags=["Health"])


@router.get("/health")
def health_check() -> dict[str, str]:
    """
    Health check endpoint

    ตรวจสอบว่า API server พร้อมใช้งาน

    Returns:
        dict: {"status": "ok"} ถ้า server ทำงานปกติ

    Example response:
        {
            "status": "ok"
        }

    Note:
        - ใช้สำหรับ load balancer / monitoring
        - ไม่ต้อง authentication
        - ควร return 200 OK เท่านั้น
    """
    return {"status": "ok"}


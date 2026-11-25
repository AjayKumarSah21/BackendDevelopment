import logging
import requests

logger = logging.getLogger(__name__)

def get_external_data(item_id):
    """Fetch a demo item; return a safe error result if the service times out."""
    try:
        response = requests.get(
            f"https://jsonplaceholder.typicode.com/posts/{item_id}",
            timeout=3,
        )
        response.raise_for_status()
        return {"data": response.json(), "error": None}
    except requests.Timeout:
        logger.warning("External service timed out for item_id=%s", item_id)
        return {"data": None, "error": "External service timed out"}
    except requests.RequestException:
        logger.exception("External service request failed for item_id=%s", item_id)
        return {"data": None, "error": "External service request failed"}

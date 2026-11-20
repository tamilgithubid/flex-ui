import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))


@pytest.fixture(autouse=True)
def reset_rate_limits():
    import main
    main.rate_limits.clear()
    yield
    main.rate_limits.clear()

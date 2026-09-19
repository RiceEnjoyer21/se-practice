import math
import unittest


def _validate_number(value, name="mark"):
    """Return value if it is a real number between 0 and 100, else raise ValueError."""
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        raise ValueError(f"{name} must be a number, got {value!r}")
    if math.isnan(value) or not 0 <= value <= 100:
        raise ValueError(f"{name} must be between 0 and 100, got {value!r}")
    return value


def analyze_marks(marks, pass_mark=50):
    """Return average, highest, lowest and pass_rate (%) for a collection of marks."""
    try:
        marks = list(marks)
    except TypeError:
        raise ValueError("marks must be an iterable of numbers") from None

    if not marks:
        raise ValueError("marks must not be empty")

    for m in marks:
        _validate_number(m, "mark")
    _validate_number(pass_mark, "pass_mark")

    passed = sum(1 for m in marks if m >= pass_mark)
    return {
        "average": round(sum(marks) / len(marks), 2),
        "highest": max(marks),
        "lowest": min(marks),
        "pass_rate": round(passed / len(marks) * 100, 2),
    }


class TestAnalyzeMarks(unittest.TestCase):
    def test_example(self):
        self.assertEqual(
            analyze_marks([40, 60, 80], 50),
            {"average": 60, "highest": 80, "lowest": 40, "pass_rate": 66.67},
        )

    def test_one_mark(self):
        self.assertEqual(
            analyze_marks([75]),
            {"average": 75, "highest": 75, "lowest": 75, "pass_rate": 100.0},
        )
        self.assertEqual(analyze_marks([30])["pass_rate"], 0.0)

    def test_decimals(self):
        self.assertEqual(
            analyze_marks([50.5, 70.25, 49.5]),
            {"average": 56.75, "highest": 70.25, "lowest": 49.5, "pass_rate": 66.67},
        )

    def test_custom_pass_mark(self):
        self.assertEqual(analyze_marks([40, 60, 80], 70)["pass_rate"], 33.33)

    def test_pass_mark_is_inclusive(self):
        self.assertEqual(analyze_marks([50, 49], 50)["pass_rate"], 50.0)

    def test_boundaries_accepted(self):
        result = analyze_marks([0, 100])
        self.assertEqual((result["lowest"], result["highest"]), (0, 100))

    def test_empty_list(self):
        with self.assertRaises(ValueError):
            analyze_marks([])

    def test_text_value(self):
        with self.assertRaises(ValueError):
            analyze_marks([40, "abc", 80])
        with self.assertRaises(ValueError):
            analyze_marks([40, "60"])  # numeric strings are not accepted

    def test_bool_and_nan_rejected(self):
        with self.assertRaises(ValueError):
            analyze_marks([True, 50])
        with self.assertRaises(ValueError):
            analyze_marks([float("nan"), 50])

    def test_below_zero(self):
        with self.assertRaises(ValueError):
            analyze_marks([-1, 50])

    def test_above_hundred(self):
        with self.assertRaises(ValueError):
            analyze_marks([50, 100.1])

    def test_invalid_pass_mark(self):
        with self.assertRaises(ValueError):
            analyze_marks([50], pass_mark=150)


if __name__ == "__main__":
    unittest.main()
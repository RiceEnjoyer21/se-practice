def analyze_marks(marks, pass_mark=50):
    def is_number(x):
        return isinstance(x, (int, float)) and not isinstance(x, bool)

    if not is_number(pass_mark) or not (float("-inf") < pass_mark < float("inf")):
        raise ValueError("pass_mark must be a finite number")

    try:
        values = list(marks)
    except TypeError:
        raise ValueError("marks must be an iterable of numbers")

    if not values:
        raise ValueError("marks must not be empty")

    for m in values:
        if not is_number(m):
            raise ValueError(f"invalid mark (not a number): {m!r}")
        # Also rejects NaN and +/-infinity, since comparisons with them are False
        if not (0 <= m <= 100):
            raise ValueError(f"mark out of range 0-100: {m!r}")

    n = len(values)
    passed = sum(1 for m in values if m >= pass_mark)

    return {
        "average": round(sum(values) / n, 2),
        "highest": max(values),
        "lowest": min(values),
        "pass_rate": round(passed / n * 100, 2),
    }

import unittest


class TestAnalyzeMarks(unittest.TestCase):
    def test_basic_example(self):
        self.assertEqual(
            analyze_marks([40, 60, 80], 50),
            {"average": 60, "highest": 80, "lowest": 40, "pass_rate": 66.67},
        )

    def test_one_mark(self):
        self.assertEqual(
            analyze_marks([100], 50),
            {"average": 100, "highest": 100, "lowest": 100, "pass_rate": 100},
        )

    def test_decimals(self):
        self.assertEqual(
            analyze_marks([49.5, 50], 50),
            {"average": 49.75, "highest": 50, "lowest": 49.5, "pass_rate": 50},
        )

    def test_custom_pass_mark(self):
        result = analyze_marks([40, 60, 80], 70)
        self.assertEqual(result["pass_rate"], 33.33)
        result = analyze_marks([40, 60, 80], 40)  # boundary is inclusive
        self.assertEqual(result["pass_rate"], 100)

    def test_default_pass_mark(self):
        self.assertEqual(analyze_marks([50, 49])["pass_rate"], 50)

    def test_exact_keys(self):
        self.assertEqual(
            set(analyze_marks([1, 2])), {"average", "highest", "lowest", "pass_rate"}
        )

    def test_empty_list(self):
        with self.assertRaises(ValueError):
            analyze_marks([], 50)

    def test_empty_generator(self):
        with self.assertRaises(ValueError):
            analyze_marks(x for x in [])

    def test_text_value(self):
        with self.assertRaises(ValueError):
            analyze_marks([40, "60"], 50)

    def test_below_zero_or_above_100(self):
        for bad in ([-1, 50, 101], [-0.1], [100.1], [101]):
            with self.subTest(bad=bad):
                with self.assertRaises(ValueError):
                    analyze_marks(bad, 50)

    def test_bool_nan_inf_none(self):
        for bad in ([True], [False, 50], [float("nan")], [float("inf")],
                    [float("-inf")], [None]):
            with self.subTest(bad=bad):
                with self.assertRaises(ValueError):
                    analyze_marks(bad, 50)

    def test_non_iterable(self):
        with self.assertRaises(ValueError):
            analyze_marks(None)

    def test_invalid_pass_mark(self):
        for bad in ("50", True, float("nan"), None):
            with self.subTest(bad=bad):
                with self.assertRaises(ValueError):
                    analyze_marks([50], bad)

    def test_generator_input(self):
        self.assertEqual(analyze_marks(m for m in [40, 60])["average"], 50)


if __name__ == "__main__":
    unittest.main()
#!/usr/bin/env python3
"""
Student Marks Analyzer
----------------------
Analyzes student marks: per-student averages and grades, per-subject statistics,
rankings, pass/fail counts, and a simple grade distribution.

Usage:
    python student_marks_analysis.py                # uses built-in sample data
    python student_marks_analysis.py marks.csv      # uses your own CSV file

CSV format (first row is a header; first column is the student name):
    Name,Math,Science,English
    Alice,88,92,79
    Bob,67,58,71

Only the Python standard library is required.
"""

import csv
import statistics
import sys

PASS_MARK = 40  # a subject mark below this counts as a fail

SAMPLE_DATA = {
    "Alice":   {"Math": 88, "Science": 92, "English": 79, "History": 85},
    "Bob":     {"Math": 67, "Science": 58, "English": 71, "History": 62},
    "Charlie": {"Math": 45, "Science": 39, "English": 52, "History": 48},
    "Diana":   {"Math": 95, "Science": 98, "English": 91, "History": 89},
    "Ethan":   {"Math": 72, "Science": 65, "English": 80, "History": 74},
    "Fatima":  {"Math": 55, "Science": 61, "English": 68, "History": 59},
    "George":  {"Math": 34, "Science": 42, "English": 38, "History": 45},
    "Hannah":  {"Math": 81, "Science": 77, "English": 94, "History": 88},
}


# ---------------------------------------------------------------- data loading
def load_csv(path):
    """Load marks from a CSV file into {student: {subject: mark}}."""
    data = {}
    with open(path, newline="", encoding="utf-8") as f:
        reader = csv.reader(f)
        header = next(reader)
        subjects = [s.strip() for s in header[1:]]
        for row in reader:
            if not row or not row[0].strip():
                continue
            name = row[0].strip()
            marks = {}
            for subject, value in zip(subjects, row[1:]):
                value = value.strip()
                if value:  # skip missing marks
                    marks[subject] = float(value)
            data[name] = marks
    return data


# -------------------------------------------------------------------- grading
def letter_grade(score):
    """Convert a percentage score to a letter grade."""
    if score >= 90:
        return "A"
    if score >= 80:
        return "B"
    if score >= 70:
        return "C"
    if score >= 60:
        return "D"
    if score >= PASS_MARK:
        return "E"
    return "F"


# ------------------------------------------------------------------- analysis
def student_summary(data):
    """Return a list of per-student stats sorted by average (highest first)."""
    rows = []
    for name, marks in data.items():
        scores = list(marks.values())
        avg = statistics.mean(scores)
        failed = [s for s, m in marks.items() if m < PASS_MARK]
        rows.append({
            "name": name,
            "total": sum(scores),
            "average": avg,
            "grade": letter_grade(avg),
            "best": max(marks, key=marks.get),
            "worst": min(marks, key=marks.get),
            "failed": failed,
        })
    rows.sort(key=lambda r: r["average"], reverse=True)
    for rank, row in enumerate(rows, start=1):
        row["rank"] = rank
    return rows


def subject_summary(data):
    """Return {subject: stats dict} across all students."""
    by_subject = {}
    for marks in data.values():
        for subject, mark in marks.items():
            by_subject.setdefault(subject, []).append(mark)

    summary = {}
    for subject, scores in by_subject.items():
        summary[subject] = {
            "mean": statistics.mean(scores),
            "median": statistics.median(scores),
            "stdev": statistics.stdev(scores) if len(scores) > 1 else 0.0,
            "min": min(scores),
            "max": max(scores),
            "pass_rate": 100 * sum(s >= PASS_MARK for s in scores) / len(scores),
        }
    return summary


def grade_distribution(rows):
    """Count students per letter grade."""
    dist = {g: 0 for g in "ABCDEF"}
    for row in rows:
        dist[row["grade"]] += 1
    return dist


# ------------------------------------------------------------------- printing
def print_header(title):
    print("\n" + "=" * 70)
    print(title)
    print("=" * 70)


def print_report(data):
    students = student_summary(data)
    subjects = subject_summary(data)
    dist = grade_distribution(students)

    print_header("STUDENT RANKINGS")
    print(f"{'Rank':<5}{'Name':<12}{'Total':>7}{'Avg':>8}{'Grade':>7}  {'Best':<10}{'Weakest':<10}")
    print("-" * 70)
    for s in students:
        print(f"{s['rank']:<5}{s['name']:<12}{s['total']:>7.0f}{s['average']:>8.1f}"
              f"{s['grade']:>7}  {s['best']:<10}{s['worst']:<10}")

    print_header("SUBJECT STATISTICS")
    print(f"{'Subject':<12}{'Mean':>8}{'Median':>8}{'StdDev':>8}{'Min':>6}{'Max':>6}{'Pass %':>9}")
    print("-" * 70)
    for subject, st in subjects.items():
        print(f"{subject:<12}{st['mean']:>8.1f}{st['median']:>8.1f}{st['stdev']:>8.1f}"
              f"{st['min']:>6.0f}{st['max']:>6.0f}{st['pass_rate']:>8.0f}%")

    hardest = min(subjects, key=lambda s: subjects[s]["mean"])
    easiest = max(subjects, key=lambda s: subjects[s]["mean"])
    print(f"\nHighest class average: {easiest} ({subjects[easiest]['mean']:.1f})")
    print(f"Lowest class average:  {hardest} ({subjects[hardest]['mean']:.1f})")

    print_header("GRADE DISTRIBUTION")
    for grade, count in dist.items():
        print(f"{grade} | {'█' * count:<10} {count}")

    print_header("OVERALL CLASS SUMMARY")
    averages = [s["average"] for s in students]
    print(f"Number of students:   {len(students)}")
    print(f"Class average:        {statistics.mean(averages):.1f}")
    print(f"Median student avg:   {statistics.median(averages):.1f}")
    print(f"Top performer:        {students[0]['name']} ({students[0]['average']:.1f})")
    print(f"Lowest performer:     {students[-1]['name']} ({students[-1]['average']:.1f})")

    at_risk = [s for s in students if s["failed"]]
    print(f"\nStudents failing at least one subject (< {PASS_MARK}):")
    if at_risk:
        for s in at_risk:
            print(f"  - {s['name']}: {', '.join(s['failed'])}")
    else:
        print("  None")


def main():
    if len(sys.argv) > 1:
        try:
            data = load_csv(sys.argv[1])
        except (OSError, ValueError, StopIteration) as e:
            sys.exit(f"Could not read '{sys.argv[1]}': {e}")
    else:
        print("No CSV file given, using sample data.")
        data = SAMPLE_DATA

    if not data:
        sys.exit("No student data found.")

    print_report(data)


if __name__ == "__main__":
    main()
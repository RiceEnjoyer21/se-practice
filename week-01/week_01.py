def student_marks(marks: list):
    valid = []
    passed = 0

    for m in marks: 
        try:
            mark = int(m)
        except(TypeError, ValueError):
            continue

        if 0<=mark<=100:
            valid.append(mark)
            if mark>=50:
                passed+=1

    if not valid:
        return "no crash, no division by zero."

    average = f"{sum(valid)/len(valid):.2f}"  
    highest = max(valid)
    lowest = min(valid)
    pass_rate = f"{round(passed/len(valid) * 100, 1)}%"

    return len(valid), average, highest, lowest, pass_rate

if __name__ == "__main__":
    marks_1 = [85, 23, 45, 90, 92]
    marks_2 = [88, 47, -5, 101, "abc", 73, 50, "", 100]
    marks_3 = [10, 20, 30]
    marks_4 = ["abc", "", "xyz"]

    print(student_marks(marks_1))
    print(student_marks(marks_2))
    print(student_marks(marks_3))
    print(student_marks(marks_4))
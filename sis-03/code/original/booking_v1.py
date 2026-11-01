# booking.py

def can_book(start, end, now, blocked, existing):
    # AC3: the room must not be blocked
    if blocked:
        return False

    # AC1: valid range, with start before end and both inside the day
    if not (0 <= start < end <= 1440):
        return False

    # AC1: booking must start strictly after the current time
    if start <= now:
        return False

    # AC2: maximum duration of 120 minutes
    if end - start > 120:
        return False

    # AC4: reject any overlap with an existing booking
    for s, e in existing:
        if start < e and s < end:
            return False

    # AC5: all of AC1-AC4 hold
    return True
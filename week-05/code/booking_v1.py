def can_book(start, end, now, blocked, existing):
    # AC1: valid range and strictly in the future
    if not (0 <= start < end <= 1440):
        return False
    if start <= now:
        return False

    # AC2: at most 120 minutes
    if end - start > 120:
        return False

    # AC3: room must not be blocked
    if blocked:
        return False

    # AC4: no overlap (half-open intervals, so touching endpoints are fine)
    for s, e in existing:
        if start < e and s < end:
            return False

    # AC5: all criteria hold; existing was only read, never modified
    return True
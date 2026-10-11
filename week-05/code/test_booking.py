# code/test_booking.py
import unittest

from booking import can_book


class TestCanBook(unittest.TestCase):
    def setUp(self):
        # Base inputs shared by all tests
        self.now = 540
        self.blocked = False
        self.existing = [(600, 660)]

    # ---- Original six tests ----

    def test_touching_end_is_allowed(self):
        result = can_book(660, 720, self.now, self.blocked, self.existing)
        self.assertIs(result, True)

    def test_overlap_is_rejected(self):
        result = can_book(630, 690, self.now, self.blocked, self.existing)
        self.assertIs(result, False)

    def test_blocked_room_is_rejected(self):
        result = can_book(660, 720, self.now, True, self.existing)
        self.assertIs(result, False)

    def test_exactly_120_minutes_is_allowed(self):
        result = can_book(720, 840, self.now, self.blocked, self.existing)
        self.assertIs(result, True)

    def test_121_minutes_is_rejected(self):
        result = can_book(720, 841, self.now, self.blocked, self.existing)
        self.assertIs(result, False)

    def test_start_equal_to_now_is_rejected(self):
        result = can_book(540, 570, self.now, self.blocked, self.existing)
        self.assertIs(result, False)

    # ---- AC1: day bounds and interval validity ----

    def test_zero_length_request_is_rejected(self):
        result = can_book(720, 720, self.now, self.blocked, self.existing)
        self.assertIs(result, False)

    def test_reversed_request_is_rejected(self):
        result = can_book(720, 690, self.now, self.blocked, self.existing)
        self.assertIs(result, False)

    def test_end_at_1440_is_allowed(self):
        result = can_book(1380, 1440, self.now, self.blocked, self.existing)
        self.assertIs(result, True)

    def test_end_after_1440_is_rejected(self):
        result = can_book(1380, 1441, self.now, self.blocked, self.existing)
        self.assertIs(result, False)

    # ---- Empty and multiple existing bookings ----

    def test_empty_existing_is_allowed(self):
        result = can_book(660, 720, self.now, self.blocked, [])
        self.assertIs(result, True)

    def test_fits_exactly_between_two_bookings(self):
        existing = [(600, 660), (720, 780)]
        result = can_book(660, 720, self.now, self.blocked, existing)
        self.assertIs(result, True)

    def test_conflict_only_with_last_entry_of_unsorted_list(self):
        existing = [(900, 960), (600, 660)]
        result = can_book(630, 690, self.now, self.blocked, existing)
        self.assertIs(result, False)

    # ---- Other overlap relationships ----

    def test_touching_existing_start_is_allowed(self):
        result = can_book(570, 600, self.now, self.blocked, self.existing)
        self.assertIs(result, True)

    def test_contained_within_existing_is_rejected(self):
        result = can_book(615, 645, self.now, self.blocked, self.existing)
        self.assertIs(result, False)

    def test_containing_existing_is_rejected(self):
        result = can_book(570, 690, self.now, self.blocked, self.existing)
        self.assertIs(result, False)

    # ---- Input immutability ----

    def test_existing_unchanged_after_accepted_request(self):
        existing = [(900, 960), (600, 660)]
        saved = list(existing)
        result = can_book(660, 720, self.now, self.blocked, existing)
        self.assertIs(result, True)
        self.assertEqual(existing, saved)

    def test_existing_unchanged_after_rejected_request(self):
        existing = [(900, 960), (600, 660)]
        saved = list(existing)
        result = can_book(630, 690, self.now, self.blocked, existing)
        self.assertIs(result, False)
        self.assertEqual(existing, saved)


if __name__ == "__main__":
    unittest.main()
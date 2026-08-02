const Donor = require('../models/Donor');
const DonorForm = require('../models/DonorForm');
const Order = require('../models/Order');

const getDonorDashboard = async (req, res) => {
  try {
    let donor = await Donor.findOne({ userId: req.user.userId });
    if (!donor) {
      donor = await Donor.findOne({ email: req.user.email });
    }

    if (!donor) {
      return res.status(404).json({ message: 'Donor profile not found' });
    }

    // Get donor postings
    const postings = await DonorForm.find({ donor_id: donor._id }).sort({ created_at: -1 });

    const formIds = postings.map(p => p._id);
    const orders = await Order.find({ donor_form_id: { $in: formIds } })
      .populate('ngo_id')
      .populate('donor_form_id')
      .sort({ created_at: -1 });

    // Calculate total meals donated & kg saved
    const totalServingsDonated = postings.reduce((acc, curr) => acc + (curr.serves || 0), 0);
    const kgSaved = Math.round(totalServingsDonated * 0.4); // approx 400g per meal
    const activeDonationsCount = postings.filter(p => p.status === 'available').length;
    const completedOrdersCount = orders.filter(o => o.status === 'delivered').length;

    res.status(200).json({
      donor,
      metrics: {
        totalMealsDonated: totalServingsDonated,
        kgSaved,
        activeDonationsCount,
        completedOrdersCount,
        co2SavedKg: Math.round(kgSaved * 2.5) // approx 2.5kg CO2 per kg food waste avoided
      },
      postings,
      orders
    });
  } catch (error) {
    console.error('Donor dashboard error:', error);
    res.status(500).json({ message: 'Error loading donor dashboard' });
  }
};

module.exports = { getDonorDashboard };

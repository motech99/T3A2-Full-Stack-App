import { Router } from "express"
import { Equipment } from '../db.js'
import { verifyAdmin, verifyUser } from "../auth.js"
import { upload } from "../cloudinary.js"

const router = Router()

// Get all Equipment Options
router.get('/equipment', async (req, res) => res.send(await Equipment.find().populate("rates.hireOption")))

// Get single equipment option
router.get('/equipment/:id', async (req, res) => {
    try {
        const equipment = await Equipment.findById(req.params.id).populate("rates.hireOption")
        if (equipment) {
            res.send(equipment)
        } else {
            res.status(404).send({ error: 'Equipment not found' })
        }
    }
    catch (err) {
        res.status(400).send({ error: err.message })
    }
})

// Update Equipment
router.put('/equipment/:id', verifyUser, verifyAdmin, async (req, res) => {
    try {
        const isAdmin = req.user.isAdmin;

        // Fetch the equipment by ID
        const equipment = await Equipment.findById(req.params.id);
        if (!equipment) {
            return res.status(404).send({ error: 'Equipment not found' });
        }

        // Update equipment fields
        equipment.item = req.body.item || equipment.item;
        equipment.quantity = req.body.quantity || equipment.quantity;
        equipment.image = req.body.image || equipment.image;

        // Update rates
        if (Array.isArray(req.body.rates)) {
            // Iterate through the provided rates
            req.body.rates.forEach(newRate => {
                // Find the rate object in the existing rates array that matches the hireOption
                const rateIndex = equipment.rates.findIndex(rate => rate.hireOption.toString() === newRate.hireOption);
                
                if (rateIndex !== -1) {
                    // Update existing rate
                    equipment.rates[rateIndex].price = newRate.price;
                } else {
                    // If the rate does not exist, add it
                    equipment.rates.push(newRate);
                }
            });
        }

        // Save the updated equipment
        const updatedEquipment = await equipment.save();

        if (isAdmin) {
            return res.send(updatedEquipment);
        } else {
            return res.status(403).send({ error: 'Access denied. You must be an admin.' });
        }
    } catch (err) {
        return res.status(400).send({ error: err.message });
    }
});



// Add new Equipment
router.post('/equipment', verifyUser, verifyAdmin, upload.single('image'), async (req, res) => {
    try {
        const { item, quantity, rates, imageUrl } = req.body;

        // Check if image is provided via URL or file upload
        let imageUrlToSave;
        if (req.file) {
            // Upload the image to Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path);
            imageUrlToSave = result.secure_url; // Get the URL of the uploaded image
        } else if (imageUrl) {
            imageUrlToSave = imageUrl; // Use the provided image URL
        } else {
            return res.status(400).send({ error: 'Image is required.' });
        }

        const newEquipment = new Equipment({
            item,
            quantity,
            rates,
            image: imageUrlToSave
        });

        await newEquipment.save();
        res.status(201).send(newEquipment);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

// Delete Equipment
router.delete('/equipment/:id', verifyUser, async (req, res) => {
    try {
        const isAdmin = req.user.isAdmin
        const equipment = await Equipment.findById(req.params.id)
        if (!equipment) {
            res.status(404).send({ error: 'Equipment not found' })
            
        } if (isAdmin) {
            await Booking.findByIdAndDelete(req.params.id)
            res.sendStatus(200)
        }else { res.status(403).send({ error: 'Access denied. You do not have permission to delete this booking.' })}
    } catch (err) {
        res.status(400).send({ error: err.message })
    }
})


export default router
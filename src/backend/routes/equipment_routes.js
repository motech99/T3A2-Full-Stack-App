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
        const isAdmin = req.user.isAdmin
        const equipment = await Equipment.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!equipment) {
            return res.status(404).send({ error: 'Equipment not found' })
            
        } if (isAdmin) {
            return res.send(equipment)
        }
        else {
            return res.status(403).send({ error: 'Access denied. You must be an admin.' })
        }
    } catch (err) {
        return res.status(400).send({ error: err.message })
    }
})


// Add new Equipment
router.post('/equipment', verifyUser, verifyAdmin, upload.single('image'), async (req, res) => {
    try {
        const { item, quantity, rates } = req.body;

        // Check if image is provided via URL or file upload
        let imageUrl;
        if (req.file) {
            imageUrl = req.file.path;  // If uploaded through Multer
        } else if (req.body.imageUrl) {
            imageUrl = req.body.imageUrl;  // If provided as a URL string
        } else {
            return res.status(400).send({ error: 'Image is required.' });
        }

        const newEquipment = new Equipment({
            item,
            quantity,
            rates,
            image: imageUrl
        });

        await newEquipment.save();
        res.status(201).send(newEquipment);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
})

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
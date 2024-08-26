import { Router } from "express"
import { Equipment } from '../db.js'
import { verifyAdmin, verifyUser } from "../auth.js"
import { cloudinary, upload } from "../cloudinary.js"

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
        const equipment = await Equipment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
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
      const { item, quantity, rates, imageUrl } = req.body;
  
      // Check if image is provided via URL or file upload
      let imageUrlToSave;
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        imageUrlToSave = result.secure_url;
      } else if (imageUrl) {
        imageUrlToSave = imageUrl;
      } else {
        return res.status(400).send({ error: 'Image is required.' });
      }
  
      // Parse rates from JSON string
      let parsedRates;
      try {
        parsedRates = JSON.parse(rates);
        if (!Array.isArray(parsedRates) || parsedRates.some(rate => !rate.hireOption || !rate.price)) {
          return res.status(400).send({ error: 'Invalid rates format.' });
        }
      } catch (error) {
        return res.status(400).send({ error: 'Invalid rates format.' });
      }
  
      const newEquipment = new Equipment({
        item,
        quantity,
        rates: parsedRates,
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
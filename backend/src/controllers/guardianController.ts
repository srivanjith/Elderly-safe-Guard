import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import GuardianRelationship from '../models/GuardianRelationship';
import User from '../models/User';
import { AuditService } from '../services/auditService';

export const addGuardian = async (req: AuthRequest, res: Response) => {
  try {
    const { email, relationship = 'Family Member', isPrimary = false } = req.body;
    const userId = req.user?.id;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Guardian email is required' });
    }

    const guardianUser = await User.findOne({ email: email.toLowerCase() });
    if (!guardianUser) {
      return res.status(404).json({ success: false, message: 'No registered user found with this email address' });
    }

    if (guardianUser._id.toString() === userId) {
      return res.status(400).json({ success: false, message: 'You cannot add yourself as a guardian' });
    }

    // Ensure guardian account has GUARDIAN role
    if (guardianUser.role !== 'GUARDIAN') {
      guardianUser.role = 'GUARDIAN';
      await guardianUser.save();
    }

    const existingRel = await GuardianRelationship.findOne({
      userId,
      guardianId: guardianUser._id
    });

    if (existingRel) {
      return res.status(400).json({ success: false, message: 'This guardian is already added' });
    }

    if (isPrimary) {
      // Unset previous primary
      await GuardianRelationship.updateMany({ userId }, { isPrimary: false });
    }

    const newRel = await GuardianRelationship.create({
      userId,
      guardianId: guardianUser._id,
      relationship,
      isPrimary
    });

    await AuditService.log('ADD_GUARDIAN', 'GuardianRelationship', userId, newRel._id.toString(), {
      guardianId: guardianUser._id.toString()
    });

    return res.status(201).json({
      success: true,
      message: 'Guardian added successfully',
      guardian: {
        id: newRel._id,
        guardianUser: {
          id: guardianUser._id,
          name: guardianUser.name,
          email: guardianUser.email,
          phone: guardianUser.phone
        },
        relationship: newRel.relationship,
        isPrimary: newRel.isPrimary
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to add guardian', error: error.message });
  }
};

export const getGuardians = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;

    if (role === 'GUARDIAN') {
      // Return list of elderly users who assigned this guardian
      const relationships = await GuardianRelationship.find({ guardianId: userId }).populate(
        'userId',
        'name email phone walletBalance'
      );
      const wards = relationships.map((rel: any) => ({
        relationshipId: rel._id,
        ward: rel.userId,
        relationship: rel.relationship,
        isPrimary: rel.isPrimary
      }));
      return res.json({ success: true, wards });
    }

    // Elderly user role - return list of guardians
    const relationships = await GuardianRelationship.find({ userId }).populate(
      'guardianId',
      'name email phone avatar'
    );
    const guardians = relationships.map((rel: any) => ({
      id: rel._id,
      guardianUser: rel.guardianId,
      relationship: rel.relationship,
      isPrimary: rel.isPrimary,
      createdAt: rel.createdAt
    }));

    return res.json({ success: true, guardians });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve guardians', error: error.message });
  }
};

export const removeGuardian = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const rel = await GuardianRelationship.findOneAndDelete({ _id: id, userId });
    if (!rel) {
      return res.status(404).json({ success: false, message: 'Guardian relationship not found' });
    }

    await AuditService.log('REMOVE_GUARDIAN', 'GuardianRelationship', userId, id);
    return res.json({ success: true, message: 'Guardian removed successfully' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to remove guardian', error: error.message });
  }
};

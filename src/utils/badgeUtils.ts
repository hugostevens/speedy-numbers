
import { Badge } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface BadgeCheckResult {
  earnedBadges: Badge[];
  shouldUpdateUI: boolean;
}

/**
 * Checks if the user has earned any new badges based on their streaks and mastery
 */
export const checkForNewBadges = async (userId: string): Promise<BadgeCheckResult> => {
  if (!userId) {
    return { earnedBadges: [], shouldUpdateUI: false };
  }
  
  const earnedBadges: Badge[] = [];
  let shouldUpdateUI = false;
  
  try {
    // Check for streak badges
    const streakBadges = await checkStreakBadges(userId);
    if (streakBadges.length > 0) {
      earnedBadges.push(...streakBadges);
      shouldUpdateUI = true;
    }
    
    // Check for mastery badges
    const masteryBadges = await checkMasteryBadges(userId);
    if (masteryBadges.length > 0) {
      earnedBadges.push(...masteryBadges);
      shouldUpdateUI = true;
    }
    
    return { earnedBadges, shouldUpdateUI };
  } catch (error) {
    console.error('Error checking for new badges:', error);
    return { earnedBadges: [], shouldUpdateUI: false };
  }
};

/**
 * Checks if the user has earned any new streak-based badges
 */
const checkStreakBadges = async (userId: string): Promise<Badge[]> => {
  const newBadges: Badge[] = [];
  
  try {
    // Fetch user's current streak
    const { data: streakData, error: streakError } = await supabase
      .from('user_streaks')
      .select('current_streak')
      .eq('user_id', userId)
      .single();
      
    if (streakError) {
      console.error('Error fetching streak data:', streakError);
      return newBadges;
    }
    
    const currentStreak = streakData?.current_streak || 0;
    
    // First Day Streak Badge (1 day)
    if (currentStreak >= 1) {
      newBadges.push({
        id: 'first-day-streak',
        name: 'First Day Streak',
        description: 'Practiced for 1 day',
        icon: 'flame',
        completed: true
      });
    }
    
    // These could be added in the future as the app grows
    if (currentStreak >= 5) {
      newBadges.push({
        id: '5-day-streak',
        name: '5 Day Streak',
        description: 'Practiced 5 days in a row',
        icon: 'flame',
        completed: true
      });
    }
    
    if (currentStreak >= 10) {
      newBadges.push({
        id: '10-day-streak',
        name: '10 Day Streak',
        description: 'Practiced 10 days in a row',
        icon: 'flame',
        completed: true
      });
    }
    
    return newBadges;
  } catch (error) {
    console.error('Error checking streak badges:', error);
    return newBadges;
  }
};

/**
 * Checks if the user has earned any new mastery-based badges
 */
const checkMasteryBadges = async (userId: string): Promise<Badge[]> => {
  const newBadges: Badge[] = [];
  
  try {
    // Check if user has any mastered questions (fast_correct_attempts >= 5)
    const { data: masteryData, error: masteryError } = await supabase
      .from('user_question_performance')
      .select('id')
      .eq('user_id', userId)
      .gte('fast_correct_attempts', 5)
      .limit(1);
      
    if (masteryError) {
      console.error('Error fetching mastery data:', masteryError);
      return newBadges;
    }
    
    // If there's at least one mastered question, award the badge
    if (masteryData && masteryData.length > 0) {
      newBadges.push({
        id: 'first-mastery',
        name: 'First Mastery',
        description: 'Mastered your first math question',
        icon: 'award',
        completed: true
      });
    }
    
    // Count mastered questions by operation for operation-specific badges
    const { data: operationCounts, error: countError } = await supabase
      .from('user_question_performance')
      .select('operation, count')
      .eq('user_id', userId)
      .gte('fast_correct_attempts', 5)
      .group('operation');
      
    if (countError) {
      console.error('Error counting mastery by operation:', countError);
      return newBadges;
    }
    
    // Check for operation-specific mastery badges
    if (operationCounts) {
      for (const opCount of operationCounts) {
        if (opCount.operation === 'addition' && Number(opCount.count) >= 5) {
          newBadges.push({
            id: 'addition-master',
            name: 'Addition Master',
            description: 'Mastered 5 addition facts',
            icon: 'trophy',
            completed: true
          });
        } else if (opCount.operation === 'subtraction' && Number(opCount.count) >= 5) {
          newBadges.push({
            id: 'subtraction-master',
            name: 'Subtraction Master',
            description: 'Mastered 5 subtraction facts',
            icon: 'trophy',
            completed: true
          });
        } else if (opCount.operation === 'multiplication' && Number(opCount.count) >= 5) {
          newBadges.push({
            id: 'multiplication-master',
            name: 'Multiplication Master',
            description: 'Mastered 5 multiplication facts',
            icon: 'trophy',
            completed: true
          });
        } else if (opCount.operation === 'division' && Number(opCount.count) >= 5) {
          newBadges.push({
            id: 'division-master',
            name: 'Division Master',
            description: 'Mastered 5 division facts',
            icon: 'trophy',
            completed: true
          });
        }
      }
    }
    
    return newBadges;
  } catch (error) {
    console.error('Error checking mastery badges:', error);
    return newBadges;
  }
};

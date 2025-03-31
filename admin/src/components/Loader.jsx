'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { Lock, Shield, Check } from 'lucide-react';

export default function LockKeyLoader({
	isLoading = true,
	color = '#0284c7', // sky-600
	successColor = '#22c55e', // green-500
	size = 'md',
}) {
	const [showLoader, setShowLoader] = useState(true);
	const [isCompleting, setIsCompleting] = useState(false);
	const [particles, setParticles] = useState([]);

	const lockControls = useAnimation();
	const keyControls = useAnimation();
	const shieldControls = useAnimation();
	const progressControls = useAnimation();

	const particleTimerRef = useRef(null);

	// Size mapping
	const sizeMap = {
		sm: {
			container: 'w-32 h-32',
			shield: 'w-24 h-24',
			lock: 'w-10 h-10',
			key: 'w-8 h-8',
			check: 'w-10 h-10',
			progressCircle: 'w-28 h-28',
			circleRadius: 50,
			circleCenter: 56,
			textBottom: '-bottom-6',
			textSize: 'text-xs',
		},
		md: {
			container: 'w-48 h-48',
			shield: 'w-32 h-32',
			lock: 'w-16 h-16',
			key: 'w-12 h-12',
			check: 'w-16 h-16',
			progressCircle: 'w-40 h-40',
			circleRadius: 70,
			circleCenter: 80,
			textBottom: '-bottom-8',
			textSize: 'text-sm',
		},
		lg: {
			container: 'w-64 h-64',
			shield: 'w-40 h-40',
			lock: 'w-20 h-20',
			key: 'w-16 h-16',
			check: 'w-20 h-20',
			progressCircle: 'w-56 h-56',
			circleRadius: 100,
			circleCenter: 112,
			textBottom: '-bottom-10',
			textSize: 'text-base',
		},
	};

	const dimensions = sizeMap[size];

	// Watch for loading state changes
	useEffect(() => {
		if (!isLoading && !isCompleting) {
			// Transition to completion animation
			setIsCompleting(true);
			runCompletionAnimation();
		} else if (isLoading && isCompleting) {
			// Reset back to loading state
			setIsCompleting(false);
			runLoadingAnimation();
		}
	}, [isLoading]);

	// Initial setup
	useEffect(() => {
		if (isLoading) {
			runLoadingAnimation();
		}

		return () => {
			if (particleTimerRef.current) {
				clearTimeout(particleTimerRef.current);
			}
		};
	}, []);

	// Create particles effect
	const createParticles = () => {
		const newParticles = [];
		for (let i = 0; i < 20; i++) {
			const angle = Math.random() * Math.PI * 2;
			const distance = 20 + Math.random() * 30;
			newParticles.push({
				id: Date.now() + i,
				x: Math.cos(angle) * distance,
				y: Math.sin(angle) * distance,
				size: 3 + Math.random() * 5,
				duration: 0.6 + Math.random() * 0.8,
			});
		}
		setParticles(newParticles);

		// Clear particles after animation
		particleTimerRef.current = setTimeout(() => {
			setParticles([]);
		}, 1500);
	};

	// Run the infinite loading animation
	const runLoadingAnimation = async () => {
		// Reset any completion states
		await Promise.all([
			lockControls.start({
				opacity: 1,
				y: 0,
				scale: 1,
				color: color,
				transition: { duration: 0.3 },
			}),
			keyControls.start({
				opacity: 1,
				y: 0,
				x: -60,
				rotate: 0,
				transition: { duration: 0.3 },
			}),
			shieldControls.start({
				scale: 1,
				borderColor: color,
				transition: { duration: 0.3 },
			}),
			progressControls.start({
				pathLength: 0,
				transition: { duration: 0.1 },
			}),
		]);

		// Start infinite animations
		lockControls.start({
			scale: [1, 1.1, 1, 1.05, 1],
			rotate: [0, 0, 0, -3, 3, -2, 0],
			transition: {
				duration: 6,
				repeat: Number.POSITIVE_INFINITY,
				ease: 'easeInOut',
				times: [0, 0.3, 0.5, 0.7, 1],
				rotate: {
					times: [0, 0.3, 0.4, 0.45, 0.5, 0.55, 0.6],
					duration: 6,
					repeat: Number.POSITIVE_INFINITY,
				},
			},
		});

		keyControls.start({
			x: [-60, -10, -10, -10, -60],
			rotate: [0, 0, 90, 0, 0],
			scale: [1, 1, 1.1, 1, 1],
			transition: {
				duration: 6,
				repeat: Number.POSITIVE_INFINITY,
				ease: 'easeInOut',
				times: [0, 0.3, 0.5, 0.7, 1],
			},
		});

		shieldControls.start({
			scale: [1, 1.05, 1],
			borderColor: [color, color, color],
			transition: {
				duration: 6,
				repeat: Number.POSITIVE_INFINITY,
				ease: 'easeInOut',
				times: [0, 0.5, 1],
			},
		});

		progressControls.start({
			pathLength: [0, 0.5, 1, 0],
			opacity: [1, 1, 1, 0.7],
			transition: {
				duration: 6,
				repeat: Number.POSITIVE_INFINITY,
				ease: 'easeInOut',
				times: [0, 0.4, 0.8, 1],
			},
		});
	};

	// Run the completion animation sequence
	const runCompletionAnimation = async () => {
		// Stop infinite animations
		lockControls.stop();
		keyControls.stop();
		shieldControls.stop();
		progressControls.stop();

		// Run completion sequence
		await keyControls.start({
			x: -5,
			rotate: 90,
			transition: { duration: 0.5, ease: 'easeInOut' },
		});

		await lockControls.start({
			scale: [1, 1.15, 1.1],
			rotate: [0, -5, 5, -3, 3, 0],
			color: successColor,
			transition: { duration: 0.8 },
		});

		await Promise.all([
			shieldControls.start({
				scale: 1.1,
				borderColor: successColor,
				transition: { duration: 0.3 },
			}),
			progressControls.start({
				pathLength: 1,
				transition: { duration: 0.5 },
			}),
		]);

		// Create particles for unlocked effect
		createParticles();

		// Fade out lock and key
		await Promise.all([
			lockControls.start({
				opacity: 0,
				y: -10,
				transition: { duration: 0.5, delay: 0.5 },
			}),
			keyControls.start({
				opacity: 0,
				y: 10,
				transition: { duration: 0.5, delay: 0.5 },
			}),
		]);
	};

	// Handle loader visibility
	useEffect(() => {
		if (!isLoading && !showLoader) {
			const timer = setTimeout(() => {
				setShowLoader(false);
			}, 2000);
			return () => clearTimeout(timer);
		}
	}, [isLoading, showLoader]);

	if (!showLoader) return null;

	return (
		<div className="flex items-center justify-center">
			<div
				className={`relative flex flex-col items-center justify-center ${dimensions.container}`}
			>
				{/* Progress circle */}
				<svg className={`absolute ${dimensions.progressCircle}`}>
					<motion.circle
						cx={dimensions.circleCenter}
						cy={dimensions.circleCenter}
						r={dimensions.circleRadius}
						stroke="#e2e8f0" // slate-200
						strokeWidth="3"
						fill="none"
					/>
					<motion.circle
						cx={dimensions.circleCenter}
						cy={dimensions.circleCenter}
						r={dimensions.circleRadius}
						stroke={isCompleting ? successColor : color}
						strokeWidth="3"
						fill="none"
						initial={{ pathLength: 0 }}
						animate={progressControls}
					/>
				</svg>

				{/* Shield background */}
				<motion.div
					className={`absolute rounded-full border-2 flex items-center justify-center ${dimensions.shield}`}
					style={{ borderColor: color }}
					initial={{ opacity: 1, scale: 1 }}
					animate={shieldControls}
				>
					<Shield className="w-full h-full text-muted-foreground/10" />
				</motion.div>

				{/* Lock */}
				<motion.div
					className="absolute"
					style={{ color }}
					initial={{ scale: 1 }}
					animate={lockControls}
				>
					<Lock className={dimensions.lock} strokeWidth={1.5} />
				</motion.div>

				{/* Key */}
				<motion.div
					className="absolute"
					style={{ color }}
					initial={{ x: -60, rotate: 0, opacity: 1 }}
					animate={keyControls}
				>
					<svg
						className={dimensions.key}
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.5"
					>
						<circle cx="7" cy="7" r="5" />
						<path d="M7 12v10l2-2 2 2 2-2 2 2" />
					</svg>
				</motion.div>

				{/* Success checkmark (appears when complete) */}
				<AnimatePresence>
					{isCompleting && (
						<motion.div
							className="absolute"
							initial={{ scale: 0, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0, opacity: 0 }}
							transition={{
								type: 'spring',
								stiffness: 300,
								damping: 20,
								delay: 1,
							}}
						>
							<Check
								className={dimensions.check}
								style={{ color: successColor }}
								strokeWidth={2}
							/>
						</motion.div>
					)}
				</AnimatePresence>

				{/* Particles */}
				<div className="absolute pointer-events-none">
					<AnimatePresence>
						{particles.map((particle) => (
							<motion.div
								key={particle.id}
								className="absolute rounded-full"
								style={{
									width: particle.size,
									height: particle.size,
									backgroundColor: successColor,
									top: 0,
									left: 0,
								}}
								initial={{ x: 0, y: 0, opacity: 1 }}
								animate={{
									x: particle.x,
									y: particle.y,
									opacity: 0,
								}}
								exit={{ opacity: 0 }}
								transition={{ duration: particle.duration }}
							/>
						))}
					</AnimatePresence>
				</div>

				{/* Loading text */}
				<motion.p
					className={`absolute ${dimensions.textBottom} font-medium ${
						dimensions.textSize
					} ${
						isCompleting
							? 'text-foreground'
							: 'text-muted-foreground'
					}`}
					animate={{
						opacity: isCompleting ? 1 : [0.7, 1, 0.7],
					}}
					transition={{
						duration: isCompleting ? 0.3 : 2,
						repeat: isCompleting ? 0 : Number.POSITIVE_INFINITY,
						ease: 'easeInOut',
					}}
				>
					{isCompleting ? 'Access Granted' : 'Loading...'}
				</motion.p>
			</div>
		</div>
	);
}

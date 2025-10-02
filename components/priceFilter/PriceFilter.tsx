import { Dispatch, SetStateAction, useRef, useState, useEffect } from "react";
import styles from "./styles.module.css";

interface FilterState {
	category: string[];
	color: string[];
	size: string[];
	price: [number | null, number | null];
}

interface PriceFilterProps {
	filter: FilterState;
	setFilter: Dispatch<SetStateAction<FilterState>>;
	title?: string;
	currency?: string;
	minPrice?: number;
	maxPrice?: number;
	step?: number;
}

const PriceFilter = ({
	filter,
	setFilter,
	title = "Price",
	currency = "$",
	minPrice = 0,
	maxPrice = 1000,
	step = 10
}: PriceFilterProps) => {

	const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);
	const [tooltipPosition, setTooltipPosition] = useState<{ left: number; value: number } | null>(null);
	const sliderRef = useRef<HTMLDivElement>(null);

	// Текущие значения или значения по умолчанию
	const currentMin = filter.price[0] ?? minPrice;
	const currentMax = filter.price[1] ?? maxPrice;

	// Обработка перемещения мыши для drag
	useEffect(() => {
		if (!isDragging || !sliderRef.current) return;

		const handleMouseMove = (e: MouseEvent) => {
			const rect = sliderRef.current!.getBoundingClientRect();
			const percent = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
			const value = Math.round((percent * (maxPrice - minPrice)) / 100 + minPrice);

			if (isDragging === 'min') {
				handleMinChange(value);
			} else if (isDragging === 'max') {
				handleMaxChange(value);
			}

			// Обновляем позицию тултипа
			setTooltipPosition({
				left: e.clientX - rect.left,
				value: Math.max(minPrice, Math.min(maxPrice, value))
			});
		};

		const handleMouseUp = () => {
			setIsDragging(null);
			setTooltipPosition(null);
		};

		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);

		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
		};
	}, [isDragging, currentMin, currentMax]);

	// Вычисление процентной позиции на слайдере
	const getPercent = (value: number) => {
		return ((value - minPrice) / (maxPrice - minPrice)) * 100;
	};

	// Обработка изменения минимального значения
	const handleMinChange = (value: number) => {
		const newMin = Math.min(value, currentMax - step);
		setFilter({
			...filter,
			price: [newMin, currentMax]
		});
	};

	// Обработка изменения максимального значения
	const handleMaxChange = (value: number) => {
		const newMax = Math.max(value, currentMin + step);
		setFilter({
			...filter,
			price: [currentMin, newMax]
		});
	};

	// Обработка клика по слайдеру
	const handleSliderClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!sliderRef.current || isDragging) return;

		const rect = sliderRef.current.getBoundingClientRect();
		const percent = ((e.clientX - rect.left) / rect.width) * 100;
		const value = Math.round((percent * (maxPrice - minPrice)) / 100 + minPrice);

		// Определяем, к какому ползунку ближе
		const distToMin = Math.abs(value - currentMin);
		const distToMax = Math.abs(value - currentMax);

		if (distToMin < distToMax) {
			handleMinChange(value);
		} else {
			handleMaxChange(value);
		}
	};

	// Показать тултип при наведении
	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!sliderRef.current) return;

		const rect = sliderRef.current.getBoundingClientRect();
		const percent = ((e.clientX - rect.left) / rect.width) * 100;
		const value = Math.round((percent * (maxPrice - minPrice)) / 100 + minPrice);

		setTooltipPosition({
			left: e.clientX - rect.left,
			value: Math.max(minPrice, Math.min(maxPrice, value))
		});
	};

	// Скрыть тултип при уходе мыши
	const handleMouseLeave = () => {
		if (!isDragging) {
			setTooltipPosition(null);
		}
	};

	// Очистка фильтра
	const clearPriceFilter = () => {
		setFilter({
			...filter,
			price: [null, null]
		});
	};

	// Проверка, активен ли фильтр
	const isActive = filter.price[0] !== null || filter.price[1] !== null;
	const isCustomRange = currentMin !== minPrice || currentMax !== maxPrice;

	return (
		<div className={styles["sidebar-price"]}>
			<div className={styles["sidebar-price__header"]}>
				<h3 className="sidebar__title">{title}</h3>
				{isCustomRange && (
					<button
						onClick={clearPriceFilter}
						className={styles["sidebar-price__clear"]}
						aria-label="Clear price filter"
					>
						Reset
					</button>
				)}
			</div>

			<div className={styles["sidebar-price__values"]}>
				<span className={styles["sidebar-price__value"]}>
					{currency}{currentMin.toFixed(2)}
				</span>
				<span className={styles["sidebar-price__separator"]}>—</span>
				<span className={styles["sidebar-price__value"]}>
					{currency}{currentMax.toFixed(2)}
				</span>
			</div>

			<div
				className={styles["sidebar-price__slider-container"]}
				onMouseMove={handleMouseMove}
				onMouseLeave={handleMouseLeave}
			>
				{/* Тултип при наведении */}
				{tooltipPosition && !isDragging && (
					<div
						className={styles["sidebar-price__tooltip"]}
						style={{ left: `${tooltipPosition.left}px` }}
					>
						{currency} {tooltipPosition.value.toFixed(2)}
					</div>
				)}

				{/* Тултипы для активных ползунков */}
				{isDragging === 'min' && (
					<div
						className={styles["sidebar-price__tooltip-active"]}
						style={{ left: `${getPercent(currentMin)}%` }}
					>
						{currency} {currentMin.toFixed(2)}
					</div>
				)}
				{isDragging === 'max' && (
					<div
						className={styles["sidebar-price__tooltip-active"]}
						style={{ left: `${getPercent(currentMax)}%` }}
					>
						{currency} {currentMax.toFixed(2)}
					</div>
				)}

				<div
					ref={sliderRef}
					className={styles["sidebar-price__slider-track"]}
					onClick={handleSliderClick}
				>
					{/* Активная область между ползунками */}
					<div
						className={styles["sidebar-price__slider-range"]}
						style={{
							left: `${getPercent(currentMin)}%`,
							width: `${getPercent(currentMax) - getPercent(currentMin)}%`
						}}
					/>

					{/* Минимальный ползунок */}
					<div
						className={`${styles["sidebar-price__slider-thumb"]} ${isDragging === 'min' ? styles["dragging"] : ""}`}
						style={{ left: `${getPercent(currentMin)}%` }}
						onMouseDown={() => setIsDragging('min')}
						role="slider"
						aria-label="Minimum price"
						aria-valuemin={minPrice}
						aria-valuemax={maxPrice}
						aria-valuenow={currentMin}
						tabIndex={0}
					/>

					{/* Максимальный ползунок */}
					<div
						className={`${styles["sidebar-price__slider-thumb"]} ${isDragging === 'max' ? styles["dragging"] : ""}`}
						style={{ left: `${getPercent(currentMax)}%` }}
						onMouseDown={() => setIsDragging('max')}
						role="slider"
						aria-label="Maximum price"
						aria-valuemin={minPrice}
						aria-valuemax={maxPrice}
						aria-valuenow={currentMax}
						tabIndex={0}
					/>
				</div>

				{/* Скрытые input для управления */}
				<input
					type="range"
					min={minPrice}
					max={maxPrice}
					step={step}
					value={currentMin}
					onChange={(e) => handleMinChange(Number(e.target.value))}
					className={styles["sidebar-price__input-hidden"]}
					aria-label="Minimum price input"
				/>
				<input
					type="range"
					min={minPrice}
					max={maxPrice}
					step={step}
					value={currentMax}
					onChange={(e) => handleMaxChange(Number(e.target.value))}
					className={styles["sidebar-price__input-hidden"]}
					aria-label="Maximum price input"
				/>
			</div>

			{/* Метки минимума и максимума */}
			<div className={styles["sidebar-price__labels"]}>
				<span className={styles["sidebar-price__label"]}>{currency}{minPrice}</span>
				<span className={styles["sidebar-price__label"]}>{currency}{maxPrice}</span>
			</div>
		</div>
	);
};

export default PriceFilter;

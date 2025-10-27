// src/components/ImageSlider.tsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { ImageSliderProps, Slide } from '../types'; 
import image1 from '../assets/shopping-mall-1.jpg';
import image2 from '../assets/shopping-mall-2.jpg';
import image3 from '../assets/shopping-mall-3.jpg';

const SLIDE_INTERVAL_TIME = 3000;

const ImageSlider: React.FC<ImageSliderProps> = ({ slides: initialSlides}) => {
    
    const slides: Slide[] = [
        { id: 1, title: "✨ NEW 시즌 파스텔 컬렉션 20% 할인 ✨", imgSrc: image1 }, // ⭐️ 변수 사용
        { id: 2, title: "🎁 첫 구매 고객 전용 사은품 증정!", imgSrc: image2 }, // ⭐️ 변수 사용
        { id: 3, title: "🌈 여름 한정! 액세서리 30% 특가!", imgSrc: image3 }, // ⭐️ 변수 사용
    ];

    const slideCount: number = slides.length;
    const totalSlidesInDOM: number = slideCount + 1; 
    
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const sliderContainerRef = useRef<HTMLDivElement>(null);
    const autoSlideIntervalRef = useRef<number | null>(null);

    const moveSlide = useCallback((index: number): void => {
        const $container = sliderContainerRef.current;
        if (!$container) return; 

        $container.style.transition = 'margin-left 0.6s ease-in-out';
        $container.style.marginLeft = `${-index * 100}%`;

        if (index === slideCount) {
            setTimeout(() => {
                $container.style.transition = 'none';
                $container.style.marginLeft = '0%';
                setCurrentIndex(0);
            }, 600);
        } else if (index < 0) {
            $container.style.transition = 'none';
            $container.style.marginLeft = `${-slideCount * 100}%`;
            
            setTimeout(() => {
                $container.style.transition = 'margin-left 0.6s ease-in-out';
                $container.style.marginLeft = `${-(slideCount - 1) * 100}%`;
                setCurrentIndex(slideCount - 1);
            }, 0);
        } else {
            setCurrentIndex(index);
        }
    }, [slideCount]);
    
    const startAutoSlide = useCallback((): void => {
        if (autoSlideIntervalRef.current !== null) {
            clearInterval(autoSlideIntervalRef.current);
        }
        
        autoSlideIntervalRef.current = window.setInterval(() => { 
            setCurrentIndex(prevIndex => (prevIndex + 1));
        }, SLIDE_INTERVAL_TIME);
    }, []);
    
    const stopAutoSlide = useCallback((): void => {
        if (autoSlideIntervalRef.current !== null) {
            clearInterval(autoSlideIntervalRef.current);
            autoSlideIntervalRef.current = null;
        }
    }, []);

    useEffect(() => {
        moveSlide(currentIndex);
    }, [currentIndex, moveSlide]);

    useEffect(() => {
        startAutoSlide();
        return stopAutoSlide;
    }, [startAutoSlide, stopAutoSlide]);


    const handleUserInteraction = (newIndex: number): void => {
        stopAutoSlide();
        moveSlide(newIndex);
        startAutoSlide();
    };

    const handleRightArrow = () => handleUserInteraction(currentIndex + 1);
    const handleLeftArrow = () => handleUserInteraction(currentIndex - 1);
    const handleDotClick = (index: number) => handleUserInteraction(index);

    const slidesWithClone: Slide[] = [...slides, slides[0]]; 

    return (
        <section className="full-width-slider-section"
            onMouseEnter={stopAutoSlide} 
            onMouseLeave={startAutoSlide} 
        >
            <div className="slider-container" ref={sliderContainerRef}
                style={{ width: `${totalSlidesInDOM * 100}%` }}
            >
                {slidesWithClone.map((slide, index) => (
                    <div className="slide" key={index} 
                         style={{ width: `${100 / totalSlidesInDOM}%` }}>
                        <a href="#">
                            <h2>{slide.title}</h2>
                        </a>
                        {/* 이미지는 public 폴더 경로 가정 */}
                        <img src={slide.imgSrc} alt={`슬라이드 ${index + 1}`} />
                    </div>
                ))}
            </div>

            <button className="slider-arrow left-arrow" onClick={handleLeftArrow}>
                <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <button className="slider-arrow right-arrow" onClick={handleRightArrow}>
                <FontAwesomeIcon icon={faChevronRight} />
            </button>
            
            <div className="slider-dots">
                {slides.map((_, index) => (
                    <span 
                        key={index}
                        // 현재 활성화된 슬라이드 인덱스는 slideCount로 나눈 나머지로 계산
                        className={`dot ${currentIndex % slideCount === index ? 'active' : ''}`}
                        onClick={() => handleDotClick(index)}
                    ></span>
                ))}
            </div>
        </section>
    );
}

export default ImageSlider;
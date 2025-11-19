"""Logging configuration for the application."""

import logging
import sys
from pathlib import Path
from typing import Optional
from loguru import logger

from app.core.config import settings


def setup_logging(log_level: Optional[str] = None) -> None:
    """
    Configure application logging using loguru.
    
    Args:
        log_level: Override default log level from settings
    """
    # Remove default handler
    logger.remove()
    
    # Get log level
    level = log_level or settings.LOG_LEVEL
    
    # Console handler with colorization
    logger.add(
        sys.stdout,
        format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>",
        level=level,
        colorize=True,
    )
    
    # File handler for all logs
    logs_dir = Path(settings.BASE_DIR) / settings.LOGS_DIR
    logs_dir.mkdir(parents=True, exist_ok=True)
    
    logger.add(
        logs_dir / "app.log",
        format="{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {name}:{function}:{line} - {message}",
        level=level,
        rotation="10 MB",
        retention="30 days",
        compression="zip",
    )
    
    # Error file handler
    logger.add(
        logs_dir / "error.log",
        format="{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {name}:{function}:{line} - {message}",
        level="ERROR",
        rotation="10 MB",
        retention="30 days",
        compression="zip",
    )
    
    logger.info(f"Logging configured with level: {level}")


def get_logger(name: str) -> logging.Logger:
    """
    Get a logger instance for a specific module.
    
    Args:
        name: Logger name (usually __name__)
        
    Returns:
        Logger instance
    """
    return logger.bind(name=name)
